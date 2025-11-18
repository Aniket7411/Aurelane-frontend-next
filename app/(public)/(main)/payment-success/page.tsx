'use client';

import { Suspense } from 'react';
import PaymentSuccess from "@reactcomponents/pages/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}

