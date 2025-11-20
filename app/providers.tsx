'use client';

import { PropsWithChildren } from "react";
import { AuthProvider } from "@reactcomponents/contexts/AuthContext";
import { CartProvider } from "@reactcomponents/contexts/CartContext";
import { ToastProvider } from "@reactcomponents/contexts/ToastContext";
import { CurrencyProvider } from "@reactcomponents/contexts/CurrencyContext";
import ScrollToTop from "@/components/ScrollToTop";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <ToastProvider>
            <ScrollToTop />
            {children}
          </ToastProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

