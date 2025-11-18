'use client';

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@reactcomponents/contexts/AuthContext";

type Role = "buyer" | "seller" | "admin";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: Role[];
}>;

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const isAuthorised =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    (user?.role ? allowedRoles.includes(user.role as Role) : allowedRoles.includes("buyer"));

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAuthorised) {
      if (user?.role === "admin") {
        router.replace("/admin-dashboard");
      } else if (user?.role === "seller") {
        router.replace("/seller-dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isAuthorised, loading, router, user?.role]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Checking permissions...
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorised) {
    return null;
  }

  return <>{children}</>;
}

