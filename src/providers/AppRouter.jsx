import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const lazyWithDelay = (importFunc) =>
  lazy(() => Promise.all([importFunc()]).then(([module]) => module));

// Pages
const HomePage = lazyWithDelay(() => import('@/pages/HomePage'));

// Auth
const Login = lazyWithDelay(() => import('@/features/auth/components/Login'));
const Signup = lazyWithDelay(() => import('@/features/auth/components/Signup'));

// Error pages
const NotFoundPage = lazy(() => import('@/pages/Errors/404NotFoundPage'));
const BadRequestPage = lazy(() => import('@/pages/Errors/400BadRequestPage'));
const UnauthorizedPage = lazy(() => import('@/pages/Errors/401UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@/pages/Errors/403ForbiddenPage'));
const InternalServerErrorPage = lazy(() => import('@/pages/Errors/500InternalServerErrorPage'));
const ServiceUnavailablePage = lazy(() => import('@/pages/Errors/503ServiceUnavailablePage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Error pages */}
          <Route path="/400" element={<BadRequestPage />} />
          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<InternalServerErrorPage />} />
          <Route path="/503" element={<ServiceUnavailablePage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
