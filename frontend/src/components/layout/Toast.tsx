import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none sm:px-0">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-lg transition-all duration-300 transform translate-y-0 ${
        isSuccess
          ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
          : isError
          ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
          : 'bg-[#f0f9ff] border-[#bae6fd] text-[#075985]'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3 min-w-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-[#0284c7] shrink-0" />}
        <p className="text-xs sm:text-sm font-semibold truncate">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
