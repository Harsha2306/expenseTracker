import React from "react";
import ToastItem from "./ToastItem";
import useToastContext from "../hooks/useToastContext";

const ToastList: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="fixed top-5 right-5 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastList;