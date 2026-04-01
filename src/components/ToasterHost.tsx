"use client";

import { Toaster } from "sonner";

export function ToasterHost() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border border-rose-100 shadow-lg shadow-rose-200/40",
        },
      }}
    />
  );
}
