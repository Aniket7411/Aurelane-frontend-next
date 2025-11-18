'use client';

import { Suspense } from 'react';
import PaymentFailure from "@reactcomponents/pages/PaymentFailure";

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentFailure />
    </Suspense>
  );
}

