'use client';

import { Suspense } from 'react';
import ResetPasswordPage from "@reactcomponents/pages/ResetPasswordPage";

export default function ResetPasswordRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

