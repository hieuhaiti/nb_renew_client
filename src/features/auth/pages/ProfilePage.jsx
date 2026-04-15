import React from 'react';
import { useTranslation } from 'react-i18next';
import RootLayout from '@/components/layout/RootLayout';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useProfilePageModel } from '@/features/auth/hooks/useProfilePageModel';
import {
  ProfileSidebar,
  ProfileHeaderActions,
  ProfileEditForm,
  ProfilePasswordForm,
  ProfileOverview,
} from '@/features/auth/components/profile/ProfileSections';

export default function ProfilePage() {
  const { t } = useTranslation();
  const {
    user,
    isProfileLoading,
    updateMutation,
    changePassMutation,
    form,
    avatarPreview,
    fieldErrors,
    isEditing,
    setIsEditing,
    pwd,
    setPwd,
    showChangePassword,
    setShowChangePassword,
    onChange,
    handleAvatarChange,
    handleUpdate,
    handleChangePassword,
  } = useProfilePageModel(t);

  if (isProfileLoading) {
    return (
      <RootLayout>
        <LoadingOverlay />
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="bg-card text-card-foreground border-border rounded-2xl border p-4 shadow-xl sm:p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
              <ProfileSidebar
                avatarPreview={avatarPreview}
                isEditing={isEditing}
                onAvatarChange={handleAvatarChange}
                form={form}
                user={user}
                t={t}
              />

              <div className="col-span-1 md:col-span-8">
                <ProfileHeaderActions
                  isEditing={isEditing}
                  showChangePassword={showChangePassword}
                  onStartPassword={() => setShowChangePassword(true)}
                  onStartEdit={() => setIsEditing(true)}
                  t={t}
                />

                {isEditing ? (
                  <ProfileEditForm
                    form={form}
                    fieldErrors={fieldErrors}
                    onChange={onChange}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    isSubmitting={updateMutation.isPending}
                    t={t}
                  />
                ) : showChangePassword ? (
                  <ProfilePasswordForm
                    pwd={pwd}
                    setPwd={setPwd}
                    fieldErrors={fieldErrors}
                    onSubmit={handleChangePassword}
                    onCancel={() => setShowChangePassword(false)}
                    isSubmitting={changePassMutation.isPending}
                    t={t}
                  />
                ) : (
                  <ProfileOverview form={form} createdAt={user?.created_at} t={t} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
