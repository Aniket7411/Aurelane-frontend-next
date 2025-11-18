'use client';

import { PropsWithChildren } from "react";
import AuthLayout from "@reactcomponents/components/layout/AuthLayout";
import PublicRoute from "@/components/auth/PublicRoute";

export default function AuthRoutesLayout({ children }: PropsWithChildren) {
  return (
    <PublicRoute>
      <AuthLayout>{children}</AuthLayout>
    </PublicRoute>
  );
}

