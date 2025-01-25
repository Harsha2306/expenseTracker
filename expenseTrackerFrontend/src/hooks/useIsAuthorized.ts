import { useEffect } from "react";
import { useNavigate } from "react-router";

const useIsAuthorized = () => {
  const navigateTo = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigateTo("/login");
  }, [navigateTo]);
};

export default useIsAuthorized;
