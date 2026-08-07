/**
 * Minimal server-side sanitizer for HTML produced by the admin rich-text
 * editor. This is not a full sanitizer (no dependency like DOMPurify is
 * installed) — it strips the highest-risk vectors (script/style/iframe
 * tags, inline event handlers, javascript: URLs) which is a reasonable
 * bar given this is single-admin-authored content, not arbitrary
 * user-generated input. If public comments or multi-author content are
 * ever added, replace this with a proper sanitizer library.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'");
}
