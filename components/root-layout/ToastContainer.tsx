"use client";

import { useTheme } from "next-themes";
import { ToastContainer as Toastify } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => {
  const { theme, systemTheme } = useTheme();

  return (
    <>
      <Toaster richColors duration={3000} />
      <Toastify
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
    </>
  );
};

export default ToastContainer;
