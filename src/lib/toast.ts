import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

export function useToast() {
  return Toast.useToastManager();
}

export function showSuccessToast(title: string, description?: string) {
  toastManager.add({
    title,
    description,
    type: "success",
    timeout: 5000,
  });
}

export function showErrorToast(title: string, description?: string) {
  toastManager.add({
    title,
    description,
    type: "error",
    timeout: 5000,
  });
}
