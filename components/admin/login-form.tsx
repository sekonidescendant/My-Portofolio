'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail, User, ShieldCheck, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fadeUp, staggerContainer } from '@/lib/animations';

const registerSchema = z.object({
  name: z.string().min(2, 'Enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type RegisterValues = z.infer<typeof registerSchema>;

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.rpc('has_admin');
        if (cancelled) return;
        if (error) {
          setAdminExists(false);
          setMode('register');
          return;
        }
        setAdminExists(!!data);
        if (data === false) {
          setMode('register');
        }
      } catch {
        if (cancelled) return;
        setAdminExists(false);
        setMode('register');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onLogin = async (values: LoginValues) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  const onRegister = async (values: RegisterValues) => {
    setError(null);
    setInfo(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setError('Registration failed. Please try again.');
      return;
    }

    // Claim first admin
    const { data: claimed, error: claimError } = await supabase.rpc('claim_first_admin');

    if (claimError) {
      setError('Account created but admin claim failed. Contact support.');
      return;
    }

    if (!claimed) {
      setError('An admin already exists. You cannot register as admin.');
      return;
    }

    setInfo('Admin account created successfully. Redirecting to dashboard...');

    // Sign in the newly registered user
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    router.push('/admin');
    router.refresh();
  };

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const showRegister = isRegister && adminExists === false;
  const showLogin = isLogin && adminExists !== false;

  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-sm space-y-6"
    >
      <motion.div variants={fadeUp} className="space-y-2 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary/60 text-primary">
          {showRegister ? <UserPlus className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          {showRegister ? 'Create Admin Account' : 'Admin Login'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {showRegister
            ? 'Register the first administrator for your portfolio.'
            : 'Sign in to manage your portfolio content.'}
        </p>
      </motion.div>

      {adminExists === null ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : showRegister ? (
        <motion.form
          variants={fadeUp}
          onSubmit={registerForm.handleSubmit(onRegister)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="reg-name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reg-name"
                placeholder="Your name"
                className="pl-9"
                {...registerForm.register('name')}
              />
            </div>
            {registerForm.formState.errors.name && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                {...registerForm.register('email')}
              />
            </div>
            {registerForm.formState.errors.email && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              {...registerForm.register('password')}
            />
            {registerForm.formState.errors.password && (
              <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          {info && (
            <p className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {info}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={registerForm.formState.isSubmitting}
          >
            {registerForm.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </motion.form>
      ) : showLogin ? (
        <motion.form
          variants={fadeUp}
          onSubmit={loginForm.handleSubmit(onLogin)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                {...loginForm.register('email')}
              />
            </div>
            {loginForm.formState.errors.email && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...loginForm.register('password')}
            />
            {loginForm.formState.errors.password && (
              <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loginForm.formState.isSubmitting}
          >
            {loginForm.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </motion.form>
      ) : (
        <motion.div variants={fadeUp} className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            An admin account already exists. Public registration is disabled.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setMode('login')}
          >
            Go to Login
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
