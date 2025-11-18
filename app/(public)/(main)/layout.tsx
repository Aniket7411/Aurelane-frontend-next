'use client';

import { PropsWithChildren } from "react";
import MainLayout from "@reactcomponents/components/layout/MainLayout";

export default function PublicMainLayout({ children }: PropsWithChildren) {
  return <MainLayout>{children}</MainLayout>;
}

