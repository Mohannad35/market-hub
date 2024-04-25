"use client";

import QueryClientProvider from "@/components/QueryClientProvider";
import { NextUIProvider } from "@nextui-org/react";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, systemTheme } = useTheme();

  return (
    <QueryClientProvider>
      <NextUIProvider>
        <SessionProvider>
          <Theme>
            {children}
            <Toaster richColors duration={3000} />
            <ToastContainer
              theme={theme === "system" ? systemTheme : theme}
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              limit={5}
            />
          </Theme>
        </SessionProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
