'use client';

import { PropsWithChildren } from "react";
import { AuthProvider } from "@reactcomponents/contexts/AuthContext";
import { CartProvider } from "@reactcomponents/contexts/CartContext";
import { ToastProvider } from "@reactcomponents/contexts/ToastContext";
import ScrollToTop from "@/components/ScrollToTop";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          {children}
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

