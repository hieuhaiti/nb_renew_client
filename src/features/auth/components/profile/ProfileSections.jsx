import React from 'react';
import { Camera, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Field({ label, children, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-foreground flex items-center text-sm font-medium">
        {Icon && <Icon className="text-muted-foreground mr-2 h-4 w-4" />}
        {label}
      </Label>
      {children}
    </div>
  );
}

export function ProfileSidebar({ avatarPreview, isEditing, onAvatarChange, form, user, t }) {
  return (
    <div className="md:border-border col-span-1 flex flex-col items-center md:col-span-4 md:border-r md:pr-6">
      <div className="group border-background bg-muted relative mb-6 h-40 w-40 overflow-hidden rounded-full border-4 shadow-lg">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-4xl">
            {form.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        {isEditing && (
          <label className="text-primary absolute inset-0 flex cursor-pointer flex-col items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="text-primary mb-1 h-8 w-8" />
            <span className="text-primary text-sm">
              {t('profile.avatar.change', 'Change photo')}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} />
          </label>
        )}
      </div>
      <h2 className="mb-1 text-center text-xl font-bold wrap-break-word">
        {form.name || form.username || 'User'}
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        {user?.role?.name || t('profile.role.member', 'Member')}
      </p>

      <div className="bg-border my-4 h-px w-full" />

      <div className="w-full space-y-3 text-sm">
        <div className="text-muted-foreground flex items-center">
          <Mail className="mr-3 h-4 w-4" />
          <span className="truncate">{form.email || t('profile.notUpdated', 'Not updated')}</span>
        </div>
        <div className="text-muted-foreground flex items-center">
          <Phone className="mr-3 h-4 w-4" />
          <span className="truncate">{form.phone || t('profile.notUpdated', 'Not updated')}</span>
        </div>
        <div className="text-muted-foreground flex items-center">
          <MapPin className="mr-3 h-4 w-4" />
          <span className="truncate">{form.address || t('profile.notUpdated', 'Not updated')}</span>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderActions({
  isEditing,
  showChangePassword,
  onStartPassword,
  onStartEdit,
  t,
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold">{t('profile.title', 'My Profile')}</h1>
      {!isEditing && !showChangePassword && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" onClick={onStartPassword} className="w-full gap-2 sm:w-auto">
            <Lock className="h-4 w-4" />
            {t('profile.changePasswordSecure', 'Change secure password')}
          </Button>
          <Button onClick={onStartEdit} className="w-full sm:w-auto">
            {t('profile.editProfile', 'Edit profile')}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProfileEditForm({
  form,
  fieldErrors,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  t,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label={t('profile.username', 'Username')} icon={User}>
          <Input name="username" value={form.username} onChange={onChange} />
          {fieldErrors.username && (
            <p className="text-destructive text-sm">{fieldErrors.username}</p>
          )}
        </Field>
        <Field label={t('profile.fullName', 'Full name')}>
          <Input name="name" value={form.name} onChange={onChange} />
          {fieldErrors.name && <p className="text-destructive text-sm">{fieldErrors.name}</p>}
        </Field>
        <Field label={t('profile.email', 'Email')} icon={Mail}>
          <Input name="email" value={form.email} onChange={onChange} disabled />
        </Field>
        <Field label={t('profile.phone', 'Phone number')} icon={Phone}>
          <Input name="phone" value={form.phone} onChange={onChange} />
          {fieldErrors.phone && <p className="text-destructive text-sm">{fieldErrors.phone}</p>}
        </Field>
      </div>

      <Field label={t('profile.address', 'Address')} icon={MapPin}>
        <Input name="address" value={form.address} onChange={onChange} />
      </Field>

      <div className="border-border flex flex-col-reverse justify-end gap-3 border-t pt-6 sm:flex-row">
        <Button variant="outline" type="button" onClick={onCancel} className="w-full sm:w-auto">
          {t('profile.cancel', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting
            ? t('profile.saving', 'Saving...')
            : t('profile.saveChanges', 'Save changes')}
        </Button>
      </div>
    </form>
  );
}

export function ProfilePasswordForm({
  pwd,
  setPwd,
  fieldErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  t,
}) {
  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-6">
      <h3 className="border-border mb-4 border-b pb-2 text-lg font-semibold">
        {t('profile.changePassword', 'Change password')}
      </h3>
      <div className="space-y-4">
        <Field label={t('profile.currentPassword', 'Current password')} icon={Lock}>
          <Input
            type="password"
            value={pwd.current}
            onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))}
          />
          {fieldErrors.current && <p className="text-destructive text-sm">{fieldErrors.current}</p>}
        </Field>
        <Field label={t('profile.newPassword', 'New password')} icon={Lock}>
          <Input
            type="password"
            value={pwd.newPassword}
            onChange={(e) => setPwd((s) => ({ ...s, newPassword: e.target.value }))}
          />
          {fieldErrors.newPassword && (
            <p className="text-destructive text-sm">{fieldErrors.newPassword}</p>
          )}
        </Field>
        <Field label={t('profile.confirmNewPassword', 'Confirm new password')}>
          <Input
            type="password"
            value={pwd.confirm}
            onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))}
          />
          {fieldErrors.confirm && <p className="text-destructive text-sm">{fieldErrors.confirm}</p>}
        </Field>
      </div>
      <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
        <Button variant="outline" type="button" onClick={onCancel} className="w-full sm:w-auto">
          {t('profile.cancelShort', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {t('profile.confirmAction', 'Confirm')}
        </Button>
      </div>
    </form>
  );
}

export function ProfileOverview({ form, createdAt, t }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
        <div>
          <div className="text-muted-foreground mb-1 text-sm font-medium">
            {t('profile.username', 'Username')}
          </div>
          <div className="font-semibold">{form.username || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-sm font-medium">
            {t('profile.phone', 'Phone number')}
          </div>
          <div className="font-semibold">{form.phone || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-sm font-medium">
            {t('profile.address', 'Address')}
          </div>
          <div className="font-semibold">{form.address || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-sm font-medium">
            {t('profile.joinDate', 'Join date')}
          </div>
          <div className="font-semibold">
            {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
