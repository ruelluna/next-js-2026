import { toast } from "sonner";
import type { ApiError } from "./api";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export function showApiError(err: ApiError): void {
  err.getErrors().then((errors) => {
    const messages = Object.values(errors).flat();
    const message = messages.length > 0 ? messages.join(" ") : err.message;
    toast.error(message);
  });
}

export function toastSuccess(message: string): void {
  toast.success(message);
}

export function toastError(message: string): void {
  toast.error(message);
}

export function toastWarning(message: string): void {
  toast.warning(message);
}

export function toastInfo(message: string): void {
  toast.info(message);
}

export function toastLoading(message: string): ReturnType<typeof toast.loading> {
  return toast.loading(message);
}
