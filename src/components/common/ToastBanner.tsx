import { Check } from 'lucide-react';

export interface ToastBannerProps {
  message: string | null;
}

export const ToastBanner = ({ message }: ToastBannerProps) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg shadow-[0_12px_32px_rgb(0_0_0/0.25)]"
    >
      <span className="inline-flex items-center gap-2">
        <Check className="h-3.5 w-3.5 opacity-70" />
        <span>{message}</span>
      </span>
    </div>
  );
};
