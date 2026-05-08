import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { tokenManager } from '@/lib/tokenManager';
import { useRegisterMutation } from '@/services/api/auth/authApi';
import useAuthStore from '@/stores/useAuthStore.js';
import RootLayout from '@/components/layout/RootLayout';

// --- Zod schema ---
const signupSchema = (t) =>
  z
    .object({
      username: z
        .string()
        .min(1, t('auth.errors.required_username'))
        .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ cái, số và dấu _'),
      email: z
        .string()
        .min(1, t('auth.errors.required_email'))
        .email(t('auth.errors.invalid_email')),
      password: z.string().min(8, t('auth.errors.password_min')),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: (ctx) => ctx.t?.('auth.errors.passwords_mismatch') ?? 'Mật khẩu không khớp',
      path: ['confirmPassword'],
    });

/**
 * Signup page — full-screen auth layout.
 * Service calls are stubbed; replace with real authService when ready.
 */
export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = z
    .object({
      username: z
        .string()
        .min(1, t('auth.errors.required_username'))
        .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ cái, số và dấu _'),
      email: z
        .string()
        .min(1, t('auth.errors.required_email'))
        .email(t('auth.errors.invalid_email')),
      password: z.string().min(8, t('auth.errors.password_min')),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.errors.passwords_mismatch'),
      path: ['confirmPassword'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const registerMut = useRegisterMutation();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await registerMut.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      const payload = res.data || res;

      if (payload.accessToken || payload.token) {
        tokenManager.setTokens(payload.accessToken || payload.token, payload.refreshToken || null);
      }
      setUser(payload.user || payload);
      toast.success(t('auth.signup.success'));
      navigate('/');
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || t('auth.errors.signup_failed');
      setError('root', { message });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValue = watch('password');

  return (
    <RootLayout>
      {/* Form area */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border-border rounded-2xl border px-8 py-10 shadow-xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="bg-primary/10 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
                <UserPlus size={24} className="text-primary" />
              </div>
              <h1 className="text-foreground text-2xl font-bold">{t('auth.signup.title')}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{t('auth.signup.description')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="signup-username">{t('auth.signup.username')}</Label>
                <Input
                  id="signup-username"
                  type="text"
                  autoComplete="username"
                  placeholder={t('auth.signup.username_placeholder')}
                  {...register('username')}
                  aria-invalid={!!errors.username}
                  className={
                    errors.username ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                />
                {errors.username && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">{t('auth.signup.email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('auth.signup.email_placeholder')}
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  className={
                    errors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                />
                {errors.email && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">{t('auth.signup.password')}</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('auth.signup.password_placeholder')}
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
                  <p className="text-destructive text-sm" role="alert">
                    {errors.password.message}
                  </p>
                )}
                {/* Password strength hint */}
                {passwordValue && passwordValue.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={[
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          passwordValue.length >= (i + 1) * 2
                            ? passwordValue.length >= 12
                              ? 'bg-primary'
                              : passwordValue.length >= 8
                                ? 'bg-amber-400'
                                : 'bg-destructive'
                            : 'bg-muted',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="signup-confirm-password">{t('auth.signup.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('auth.signup.confirmPassword_placeholder')}
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                    className={[
                      'pr-10',
                      errors.confirmPassword
                        ? 'border-destructive focus-visible:ring-destructive'
                        : '',
                    ].join(' ')}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    tabIndex={-1}
                    className="bg-card text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
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
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-2.5 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {t('auth.signup.loading')}
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    {t('auth.signup.submit')}
                  </>
                )}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-muted-foreground mt-6 text-center text-sm">
              {t('auth.signup.haveAccount')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('auth.signup.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
