/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { IUserDetails } from "../types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";

const initialState: IUserDetails = {
  fullName: "",
  email: "",
  password: "",
  errors: {},
};

const API =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8080/api/auth";

const SignupForm = () => {
  const [userDetails, setUserDetails] = useState<IUserDetails>(initialState);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserDetails((prev) => {
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
        await axios.post(`${API}/signup`, userDetails);
        navigate("/login");
      } catch (error: unknown) {
        if (axios.isAxiosError(error))
          setUserDetails((prev) => {
            return { ...prev, errors: error.response?.data?.errors };
          });
      } finally {
        setDisabled(false);
      }
    },
    [navigate, userDetails]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-center text-gray-500">
          Track your expenses effortlessly
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            labelClassName="block text-sm font-medium text-gray-700"
            placeHolder="Enter your full name"
            label="Name"
            id="fullName"
            value={userDetails.fullName}
            onChange={handleInputChange}
            type="text"
            errorId={userDetails.errors.fullName}
            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-2 focus:outline-none"
          />
          <Input
            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-2 focus:outline-none"
            labelClassName="block text-sm font-medium text-gray-700"
            placeHolder="Enter your email"
            label="Email"
            id="email"
            value={userDetails.email}
            onChange={handleInputChange}
            errorId={userDetails.errors.email}
          />
          <Input
            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:ring-2 focus:outline-none"
            labelClassName="block text-sm font-medium text-gray-700"
            placeHolder="Enter your password"
            label="Password"
            id="password"
            value={userDetails.password}
            onChange={handleInputChange}
            type="password"
            errorId={userDetails.errors.password}
          />
          <Button
            disabled={disabled}
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Submit
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
