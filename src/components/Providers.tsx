"use client";

import { ToastItem } from "./ui/Toast";
import { toastManager } from "../lib/toast";
import { Toast as BaseToast } from "@base-ui/react/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseToast.Provider toastManager={toastManager}>
      {children}
      <ToastViewport />
    </BaseToast.Provider>
  );
}

function ToastViewport() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className="fixed top-4 left-4 right-4 z-50 mx-auto flex max-w-[800px] flex-col gap-2 sm:left-auto sm:right-8 sm:mx-0 sm:w-80">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}