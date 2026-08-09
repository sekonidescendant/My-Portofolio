'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { updateSettings } from '@/lib/actions/contact-actions';
import type { Settings } from '@/lib/types/database';
import type { MediaItem } from '@/types';

export function SettingsManager({
  initialSettings,
  mediaItems,
}: {
  initialSettings: Settings | null;
  mediaItems: MediaItem[];
}) {
  const router = useRouter();

  const [name, setName] = useState(initialSettings?.name ?? '');
  const [role, setRole] = useState(initialSettings?.role ?? '');
  const [description, setDescription] = useState(initialSettings?.description ?? '');
  const [email, setEmail] = useState(initialSettings?.email ?? '');
  const [phone, setPhone] = useState(initialSettings?.phone ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialSettings?.linkedin_url ?? '');
  const [githubUrl, setGithubUrl] = useState(initialSettings?.github_url ?? '');
  const [twitterUrl, setTwitterUrl] = useState(initialSettings?.twitter_url ?? '');
  const [portfolioUrl, setPortfolioUrl] = useState(initialSettings?.portfolio_url ?? '');
  const [logo, setLogo] = useState<{ id: string; url: string } | null>(
    initialSettings?.logo_url ? { id: 'logo', url: initialSettings.logo_url } : null,
  );
  const [favicon, setFavicon] = useState<{ id: string; url: string } | null>(
    initialSettings?.favicon_url ? { id: 'favicon', url: initialSettings.favicon_url } : null,
  );
  const [seoTitle, setSeoTitle] = useState(initialSettings?.seo_title ?? '');
  const [seoDescription, setSeoDescription] = useState(initialSettings?.seo_description ?? '');
  const [gaId, setGaId] = useState(initialSettings?.google_analytics_id ?? '');

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!email.trim()) {
      toast.error('Email is required.');
      return;
    }

    setSaving(true);
    const result = await updateSettings({
      name: name.trim(),
      role: role.trim(),
      description: description.trim(),
      email: email.trim(),
      phone: phone.trim(),
      linkedin_url: linkedinUrl.trim(),
      github_url: githubUrl.trim(),
      twitter_url: twitterUrl.trim(),
      portfolio_url: portfolioUrl.trim(),
      logo_url: logo?.url ?? '',
      favicon_url: favicon?.url ?? '',
      seo_title: seoTitle.trim(),
      seo_description: seoDescription.trim(),
      google_analytics_id: gaId.trim(),
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error ?? 'Failed to save settings.');
      return;
    }
    toast.success('Settings saved');
    router.refresh();
  }

  return (
    <Container className="max-w-3xl space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Site identity, branding, links, and SEO defaults.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-5">
        <p className="text-sm font-medium">Identity</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Site title / your name</Label>
            <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pelumi Sekoni" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-role">Professional title</Label>
            <Input
              id="settings-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Digital Operations & Project Coordinator"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-description">Description</Label>
          <Textarea
            id="settings-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Shown in the footer and used as a fallback site description."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-phone">Phone</Label>
            <Input id="settings-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-5">
        <p className="text-sm font-medium">Social links</p>
        <p className="text-xs text-muted-foreground">Leave a field blank to hide that link from the footer entirely.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-linkedin">LinkedIn URL</Label>
            <Input id="settings-linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-github">GitHub URL</Label>
            <Input id="settings-github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-twitter">X / Twitter URL</Label>
            <Input id="settings-twitter" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-portfolio">Portfolio URL</Label>
            <Input id="settings-portfolio" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-5">
        <p className="text-sm font-medium">Branding</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo</Label>
            <MediaPickerDialog items={mediaItems} value={logo} onChange={setLogo} />
            <p className="text-xs text-muted-foreground">Shown in the header and footer. Falls back to your initial if unset.</p>
          </div>
          <div className="space-y-2">
            <Label>Favicon</Label>
            <MediaPickerDialog items={mediaItems} value={favicon} onChange={setFavicon} />
            <p className="text-xs text-muted-foreground">Shown in the browser tab. Use a square image.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-5">
        <p className="text-sm font-medium">SEO defaults</p>
        <div className="space-y-2">
          <Label htmlFor="settings-seo-title">Default SEO title</Label>
          <Input id="settings-seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-seo-description">Default SEO description</Label>
          <Textarea id="settings-seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-ga">Google Analytics ID</Label>
          <Input id="settings-ga" value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save settings
        </Button>
      </div>
    </Container>
  );
}
