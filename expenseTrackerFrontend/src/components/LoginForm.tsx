import { useCallback, useState } from "react";
import Button from "./Button";
import { IUserCredentials } from "../types";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const initialState: IUserCredentials = {
  email: "",
  password: "",
  errors: {},
};

const API =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080/api/auth";

const LoginForm = () => {
  const [disabled, setDisabled] = useState(false);
  const [userCredentials, setUserCredentials] =
    useState<IUserCredentials>(initialState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserCredentials((prev) => {
        const { errors, ...rest } = prev;
        const { [e.target.id as keyof typeof errors]: removedError, ...newErrors } = errors;
        return {
          ...rest,
          [e.target.id]: e.target.value,
          errors: newErrors,
        };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setDisabled(true);
        setIsLoading(true);
        const res = await axios.post(
          `${API}/login`,
          userCredentials
        );
        const token: string = res.data.data;
        localStorage.setItem("token", token);
        navigate("/");
      } catch (error: unknown) {
        if (axios.isAxiosError(error))
          setUserCredentials((prev) => {
            return { ...prev, errors: error.response?.data?.errors };
          });
      } finally {
        setDisabled(false);
        setIsLoading(false);
      }
    },
    [navigate, userCredentials]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-700">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
        <p className="text-center text-gray-500">
          Welcome back! Please log in to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            labelClassName="block text-sm font-medium text-gray-700"
            placeHolder="Enter your email"
            id="email"
            label="Email"
            onChange={handleInputChange}
            value={userCredentials.email}
            errorId={userCredentials.errors?.email}
            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-2 focus:outline-none"
          />
          <Input
            labelClassName="block text-sm font-medium text-gray-700"
            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-2 focus:outline-none"
            type="password"
            placeHolder="Enter your password"
            id="password"
            label="Password"
            onChange={handleInputChange}
            value={userCredentials.password}
            errorId={userCredentials.errors?.password}
          />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Button
              disabled={disabled}
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Log In
            </Button>
          )}
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-green-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;