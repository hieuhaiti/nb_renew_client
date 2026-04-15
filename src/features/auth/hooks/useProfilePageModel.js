import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { withBaseUrl } from '@/lib/utils';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '@/features/auth/api/authApi';
import useAuthStore from '@/stores/useAuthStore';

export function useProfilePageModel(t) {
  const setStoreUser = useAuthStore((state) => state.setUser);
  const storeUser = useAuthStore((state) => state.user);

  const profileQuery = useGetProfileQuery();
  const profile = profileQuery?.data;
  const user = profile?.data?.user || profile?.data || profile?.user || profile || storeUser;

  const isProfileLoading = profileQuery.isLoading || profileQuery.isFetching;
  const updateMutation = useUpdateProfileMutation();
  const changePassMutation = useChangePasswordMutation();

  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [pwd, setPwd] = useState({ current: '', newPassword: '', confirm: '' });
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        name: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      if (user.avatar || user.avatar_url) {
        setAvatarPreview(withBaseUrl(user.avatar || user.avatar_url));
      }
    }
  }, [user]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.toast.invalidImage', 'Invalid image file type.'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.toast.imageTooLarge', 'Image size must be 5MB or less.'));
      return;
    }
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleUpdate(e) {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (form.username && !/^[a-zA-Z0-9]{3,50}$/.test(form.username)) {
      errors.username = t(
        'profile.validation.username',
        'Username must contain only letters and numbers, 3-50 characters.'
      );
    }
    if (form.email) {
      if (form.email.length > 100) {
        errors.email = t('profile.validation.emailMax', 'Email must be at most 100 characters.');
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        errors.email = t('profile.validation.invalidEmail', 'Invalid email format.');
      }
    }
    if (form.name) {
      if (form.name.length < 2) {
        errors.name = t('profile.validation.nameMin', 'Full name must be at least 2 characters.');
      } else if (!/^[\p{L}\s\-.'’]+$/u.test(form.name)) {
        errors.name = t('profile.validation.invalidName', 'Invalid full name.');
      }
    }
    if (form.phone && !/^[0-9+\-\s()]{10,20}$/.test(form.phone)) {
      errors.phone = t('profile.validation.invalidPhone', 'Invalid phone number.');
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      username: form.username || undefined,
      full_name: form.name || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
    };

    if (avatarFile) {
      const fd = new FormData();
      fd.append('avatar_url', avatarFile);
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, v);
      });

      updateMutation.mutate(fd, {
        onSuccess: (res) => {
          setIsEditing(false);
          setAvatarFile(null);
          toast.success(t('profile.toast.updateSuccess', 'Profile updated successfully!'));
          profileQuery.refetch();
          if (res?.data?.user) setStoreUser(res.data.user);
        },
        onError: (err) =>
          toast.error(
            err?.response?.data?.message ||
              t('profile.toast.updateError', 'Failed to update profile.')
          ),
      });
      return;
    }

    updateMutation.mutate(payload, {
      onSuccess: (res) => {
        setIsEditing(false);
        toast.success(t('profile.toast.updateSuccess', 'Profile updated successfully!'));
        profileQuery.refetch();
        if (res?.data?.user) setStoreUser(res.data.user);
      },
      onError: (err) =>
        toast.error(
          err?.response?.data?.message ||
            t('profile.toast.updateError', 'Failed to update profile.')
        ),
    });
  }

  function handleChangePassword(e) {
    e.preventDefault();
    setFieldErrors({});

    const pwErrors = {};
    const pwdPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/;

    if (!pwd.current) {
      pwErrors.current = t('profile.validation.currentRequired', 'Current password is required.');
    }

    if (!pwd.newPassword) {
      pwErrors.newPassword = t('profile.validation.newRequired', 'New password is required.');
    } else {
      if (pwd.newPassword.length < 8) {
        pwErrors.newPassword = t(
          'profile.validation.newMin',
          'New password must be at least 8 characters.'
        );
      } else if (!pwdPattern.test(pwd.newPassword)) {
        pwErrors.newPassword = t(
          'profile.validation.newWeak',
          'New password must include lowercase, uppercase, number, and special character.'
        );
      }
    }

    if (!pwd.confirm || pwd.confirm !== pwd.newPassword) {
      pwErrors.confirm = t(
        'profile.validation.confirmMismatch',
        'Password confirmation does not match.'
      );
    }

    if (Object.keys(pwErrors).length) {
      setFieldErrors(pwErrors);
      return;
    }

    changePassMutation.mutate(
      {
        currentPassword: pwd.current,
        newPassword: pwd.newPassword,
        confirmNewPassword: pwd.confirm,
      },
      {
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            t('profile.toast.changePasswordError', 'Failed to change password.');
          toast.error(msg);
        },
        onSuccess: () => {
          setPwd({ current: '', newPassword: '', confirm: '' });
          setShowChangePassword(false);
          setFieldErrors({});
          toast.success(t('profile.toast.changePasswordSuccess', 'Password changed successfully.'));
        },
      }
    );
  }

  return {
    user,
    isProfileLoading,
    updateMutation,
    changePassMutation,
    form,
    setForm,
    avatarPreview,
    avatarFile,
    fieldErrors,
    setFieldErrors,
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
  };
}
