'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
      return;
    }

    if (!loading && user) {
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data?.is_admin) {
            router.push('/admin/login');
            return;
          }
          setIsAdmin(true);
        });
    }
  }, [user, loading, router, supabase]);

  if (loading || (user && isAdmin === null)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
      </Container>
    );
  }

  return <>{children}</>;
}
