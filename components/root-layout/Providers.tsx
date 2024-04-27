"use client";

import QueryClientProvider from "./QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextUIProvider } from "@nextui-org/system";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
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
              toastClassName="dark:border dark:border-default-100"
              theme={theme === "system" ? systemTheme : theme}
              position="bottom-right"
              stacked
              hideProgressBar
              draggable
              pauseOnHover
              closeOnClick
              pauseOnFocusLoss={false}
              limit={10}
            />
          </Theme>
        </SessionProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
