import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-fade-in ${
              toast.type === "success"
                ? "bg-neutral-900/90 border-green-500/30 text-green-400"
                : toast.type === "error"
                ? "bg-neutral-900/90 border-red-500/30 text-red-400"
                : "bg-neutral-900/90 border-blue-500/30 text-blue-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle2 size={20} className="shrink-0" />}
              {toast.type === "error" && <AlertCircle size={20} className="shrink-0" />}
              {toast.type === "info" && <Info size={20} className="shrink-0" />}
              <p className="text-sm font-medium text-neutral-200">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return fallback no-op if context is missing
    return { addToast: () => {} };
  }
  return context;
}
