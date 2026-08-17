// Runs once daily via .github/workflows/daily-draft.yml — NOT part of the
// Next.js app itself. Pulls the oldest unused topic from content_topics,
// asks Gemini (free tier) to write a full draft article, inserts it
// into the articles table as a draft, marks the topic used, and emails a
// notification. Pure Node.js — no npm dependencies required.

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const GEMINI_API_KEY = requireEnv('GEMINI_API_KEY');
// Google's free-tier model lineup moves fairly often. If this default ever
// starts returning errors, check https://ai.google.dev/gemini-api/docs/models
// for the current free model and override via the GEMINI_MODEL secret —
// no code change needed.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const RESEND_API_KEY = requireEnv('RESEND_API_KEY');
const NOTIFY_EMAIL = requireEnv('NOTIFY_EMAIL');
const SITE_URL = process.env.SITE_URL || 'https://my-portofolio-xi-six.vercel.app';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

const sb = {
  async get(path) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`Supabase GET ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Supabase POST ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
  },
  async patch(path, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Supabase PATCH ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
  },
};

async function sendEmail(subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Course Correct Bot <onboarding@resend.dev>',
      to: [NOTIFY_EMAIL],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error(`Resend email failed (non-fatal): ${res.status} ${await res.text()}`);
  }
}

const SYSTEM_PROMPT = `You are ghostwriting a blog article for Pelumi Sekoni, a Digital Operations & Project Coordinator with real experience in startup operations, documentation, project execution, community growth, and content strategy — including leading Blockchain FUOYE (a student blockchain community) and working as COO at Verrsa Social Media.

Write in first person, as Pelumi. Voice: direct, practical, grounded in specifics rather than generic advice — the kind of writing that reads like it came from someone who actually did the work, not a generic AI listicle. Avoid clichés like "In today's fast-paced world" or "Let's dive in." No emoji. No hashtags.

Respond in EXACTLY this format, nothing before or after:

<title>A specific, concrete title — not generic</title>
<slug>url-friendly-slug</slug>
<excerpt>One or two sentence summary, 25 words max</excerpt>
<category>One of: Operations, AI, Startups, Community, Blockchain, Productivity, WordPress</category>
<content>
Full article in Markdown. 1000-1400 words. Use ## for section headings, occasional **bold** for emphasis, and real paragraphs — not bullet-point-only content. Ground it in specific, plausible detail rather than vague generalities.
</content>`;

async function generateDraft(topic) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': GEMINI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: `Write the article. Topic: ${topic}` }] }],
      generationConfig: { maxOutputTokens: 4000, temperature: 0.9 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini call failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

  const extract = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    return match ? match[1].trim() : '';
  };

  const title = extract('title');
  const excerpt = extract('excerpt');
  const category = extract('category');
  const content = extract('content');
  let slug = extract('slug') || slugify(title);
  slug = slugify(slug);

  if (!title || !content) {
    throw new Error(`Could not parse model output. Raw response:\n${text.slice(0, 2000)}`);
  }

  return { title, slug, excerpt, category, content };
}

async function main() {
  console.log('Fetching next unused topic...');
  const topics = await sb.get('content_topics?used=eq.false&order=created_at.asc&limit=1');

  if (!topics.length) {
    console.log('No unused topics in queue. Sending notification and exiting.');
    await sendEmail(
      'Draft topic queue is empty',
      `<p>The daily draft job ran but found no topics queued. Add more at <a href="${SITE_URL}/admin/topics">${SITE_URL}/admin/topics</a>.</p>`,
    );
    return;
  }

  const topicRow = topics[0];
  console.log(`Selected topic: ${topicRow.topic}`);

  console.log('Generating draft...');
  const draft = await generateDraft(topicRow.topic);

  console.log('Looking up category...');
  const categories = await sb.get(`categories?name=ilike.${encodeURIComponent(draft.category)}&select=id`);
  const categoryId = categories[0]?.id ?? null;
  if (!categoryId) {
    console.warn(`No matching category for "${draft.category}" — article will save with no category.`);
  }

  console.log('Ensuring slug is unique...');
  let finalSlug = draft.slug;
  let suffix = 1;
  while (true) {
    const existing = await sb.get(`articles?slug=eq.${encodeURIComponent(finalSlug)}&select=id`);
    if (!existing.length) break;
    suffix += 1;
    finalSlug = `${draft.slug}-${suffix}`;
  }

  console.log('Inserting draft article...');
  const inserted = await sb.post('articles', {
    title: draft.title,
    slug: finalSlug,
    excerpt: draft.excerpt,
    content: draft.content,
    category_id: categoryId,
    status: 'draft',
    reading_time: estimateReadingTime(draft.content),
    featured_image_url: null,
    featured_image_id: null,
    seo_title: null,
    seo_description: null,
    published_at: null,
    scheduled_for: null,
  });
  const newArticle = inserted[0];
  console.log(`Inserted article ${newArticle.id}: "${draft.title}"`);

  console.log('Marking topic as used...');
  await sb.patch(`content_topics?id=eq.${topicRow.id}`, {
    used: true,
    used_at: new Date().toISOString(),
    created_article_id: newArticle.id,
  });

  console.log('Sending notification email...');
  await sendEmail(
    `New draft ready: ${draft.title}`,
    `<p>A new draft is ready for review.</p>
     <p><strong>${draft.title}</strong></p>
     <p>${draft.excerpt}</p>
     <p><a href="${SITE_URL}/admin/articles">Review it in the admin →</a></p>`,
  );

  console.log('Done.');
}

main().catch(async (err) => {
  console.error('Daily draft job failed:', err);
  try {
    await sendEmail('Daily draft job failed', `<p>The daily draft job errored:</p><pre>${String(err).slice(0, 3000)}</pre>`);
  } catch {
    // If even the failure email fails, the GitHub Actions run itself will
    // still show as failed — that's the fallback signal.
  }
  process.exit(1);
});
