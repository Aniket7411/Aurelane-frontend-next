'use client';

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@reactcomponents/contexts/AuthContext";

type Role = "buyer" | "seller" | "admin";

/**
 * Placeholder public route guard that redirects authenticated users
 * to the correct dashboard based on their role.
 */
export default function PublicRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading || !isAuthenticated) {
      return;
    }

    const userRole = user?.role as Role | undefined;

    switch (userRole) {
      case "admin":
        router.replace("/admin-dashboard");
        break;
      case "seller":
        router.replace("/seller-dashboard");
        break;
      default:
        router.replace("/");
        break;
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

