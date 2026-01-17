import { Toast as BaseToast } from "@base-ui/react/toast";
import { X } from "lucide-react";

interface ToastProps {
  toast: BaseToast.Root.ToastObject;
}

export function ToastItem({ toast }: ToastProps) {
  const borderColor =
    toast.type === "success"
      ? "border-green-500"
      : toast.type === "error"
      ? "border-red-500"
      : "border-(--g-88)";

  return (
    <BaseToast.Root
      toast={toast}
      className={`flex items-start gap-3 overflow-hidden rounded-10 border bg-(--g-100) py-3 pl-4 pr-3 shadow-lg transition-all duration-200 data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-(--toast-swipe-move-x) data-starting-style:-translate-y-full data-starting-style:opacity-0 data-ending-style:-translate-y-full data-ending-style:opacity-0 sm:data-starting-style:translate-y-0 sm:data-starting-style:translate-x-[calc(100%+1rem)] sm:data-ending-style:translate-y-0 sm:data-ending-style:translate-x-[calc(100%+1rem)] ${borderColor}`}
    >
      <div className="flex-1">
        <BaseToast.Title
          render={<p />}
          className="text-sm font-medium text-(--g-12)"
        >
          {toast.title}
        </BaseToast.Title>
        {toast.description && (
          <BaseToast.Description className="mt-0.5 text-xs text-(--g-20)/70">
            {toast.description}
          </BaseToast.Description>
        )}
      </div>
      <BaseToast.Close className="shrink-0 rounded p-0.5 text-(--g-20)/50 hover:text-(--g-20)">
        <X className="h-3.5 w-3.5" />
      </BaseToast.Close>
    </BaseToast.Root>
  );
}