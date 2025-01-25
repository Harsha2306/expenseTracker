import React, { useCallback } from "react";
import Button from "./Button";
import { useNavigate } from "react-router";

const Logout: React.FC = () => {
  const navigateTo = useNavigate();

  const handleLogout = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) localStorage.removeItem("token");
    navigateTo("/login");
  }, [navigateTo]);

  return (
    <Button
      type="button"
      onClick={handleLogout}
      className="absolute top-4 right-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </Button>
  );
};

export default Logout;
