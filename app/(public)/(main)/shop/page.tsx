'use client';

import { Suspense } from 'react';
import Shop from "@reactcomponents/pages/Shop";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Shop />
    </Suspense>
  );
}

