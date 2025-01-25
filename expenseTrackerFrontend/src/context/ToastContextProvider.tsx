import React, { createContext, useState } from "react";
import { IToast } from "../types";

interface IToastContext {
  toasts: IToast[];
  removeToast: (id: string) => void;
  addToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<IToastContext>({
  toasts: [],
  removeToast: () => {
    console.warn("removeToast called outside ToastProvider");
  },
  addToast: () => {
    console.warn("addToast called outside ToastProvider");
  },
});

const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => {
    const newToast = { id: Date.now().toString(), message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
