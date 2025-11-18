'use client';

import { PropsWithChildren } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@reactcomponents/components/layout/MainLayout";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

