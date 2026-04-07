"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface Toast {
  id: number;
  message: string;
  icon?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, icon?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, icon?: string, duration = 3000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, icon, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-xl border bg-card/95 backdrop-blur-md px-5 py-3 shadow-lg flex items-center gap-2.5 text-sm font-medium text-foreground max-w-sm"
          >
            {t.icon && <span className="text-lg">{t.icon}</span>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
