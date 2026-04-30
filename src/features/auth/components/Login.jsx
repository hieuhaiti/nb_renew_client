import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-toastify';
import { tokenManager } from '@/lib/tokenManager';
import { useLoginMutation } from '@/services/api/auth/authApi';
import useAuthStore from '@/stores/useAuthStore';
import RootLayout from '@/components/layout/RootLayout';

// --- Zod schema ---
const loginSchema = (t) =>
  z.object({
    login: z.string().min(1, t('auth.errors.required_login')),
    password: z.string().min(1, t('auth.errors.required_password')),
    remember: z.boolean().optional(),
  });

/**
 * Login page — full-screen auth layout with header controls.
 * Service calls are stubbed; replace with real authService when ready.
 */
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: { login: '', password: '', remember: false },
  });

  const loginMut = useLoginMutation();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginMut.mutateAsync({ login: data.login, password: data.password });
      const payload = res.data || res;

      if (payload.accessToken || payload.token) {
        tokenManager.setTokens(payload.accessToken || payload.token, payload.refreshToken || null);
      }
      setUser(payload.user || payload);
      toast.success(t('auth.login.success'));
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || t('auth.errors.login_failed');
      setError('root', { message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootLayout>
      {/* Form area */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border-border rounded-2xl border px-8 py-10 shadow-xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
                <LogIn size={24} className="text-primary" />
              </div>
              <h1 className="text-foreground text-2xl font-bold">{t('auth.login.title')}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{t('auth.login.description')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Login field */}
              <div className="space-y-1.5">
                <Label htmlFor="login-field">{t('auth.login.email_or_username')}</Label>
                <Input
                  id="login-field"
                  type="text"
                  autoComplete="username"
                  placeholder={t('auth.login.email_placeholder')}
                  {...register('login')}
                  aria-invalid={!!errors.login}
                  className={
                    errors.login ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                />
                {errors.login && (
                  <p className="text-destructive text-xs" role="alert">
                    {errors.login.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label htmlFor="login-password">{t('auth.login.password')}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('auth.login.password_placeholder')}
                    {...register('password')}
                    aria-invalid={!!errors.password}
                    className={[
                      'pr-10',
                      errors.password ? 'border-destructive focus-visible:ring-destructive' : '',
                    ].join(' ')}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    tabIndex={-1}
                    className="bg-card text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="login-remember" {...register('remember')} />
                  <Label htmlFor="login-remember" className="cursor-pointer text-sm font-normal">
                    {t('auth.login.remember')}
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-primary text-xs hover:underline"
                  tabIndex={0}
                >
                  {t('auth.login.forgot')}
                </Link>
              </div>

              {/* Root error */}
              {errors.root && (
                <div
                  className="bg-destructive/10 border-destructive/30 text-destructive rounded-lg border px-4 py-3 text-sm"
                  role="alert"
                >
                  {errors.root.message}
                </div>
              )}

              {/* Submit */}
              <Button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-2.5 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {t('auth.login.loading')}
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="mr-2" />
                    {t('auth.login.submit')}
                  </>
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <p className="text-muted-foreground mt-6 text-center text-sm">
              {t('auth.login.noAccount')}{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                {t('auth.login.signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
