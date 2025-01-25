import React, { useEffect } from "react";
import { ToastItemProps } from "../types";

const ToastItem: React.FC<ToastItemProps> = ({
  id,
  message,
  type = "info",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex justify-between items-center mb-2 ${getToastStyle()}`}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 bg-transparent text-white font-bold"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastItem;
