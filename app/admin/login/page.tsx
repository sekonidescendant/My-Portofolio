import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Container } from '@/components/layout/container';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Admin Login',
  description: 'Sign in to manage your portfolio content.',
  path: '/admin/login',
});

export default function AdminLoginPage() {
  return (
    <PageWrapper>
      <Container className="flex min-h-[60vh] items-center justify-center py-20">
        <LoginForm />
      </Container>
    </PageWrapper>
  );
}
