'use client';

import { PropsWithChildren } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@reactcomponents/components/layout/MainLayout";

export default function SellerProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

