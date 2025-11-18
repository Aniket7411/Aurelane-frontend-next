'use client';

import { PropsWithChildren } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@reactcomponents/components/layout/MainLayout";

export default function AdminOnlyLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

