import { useContext } from "react";
import { ToastContext } from "../context/ToastContextProvider";

const useToastContext = () => {
  return useContext(ToastContext);
};

export default useToastContext;
