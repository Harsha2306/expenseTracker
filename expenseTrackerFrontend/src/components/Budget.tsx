import React, { memo, useCallback, useEffect, useState } from "react";
import { IBudget, ISummary } from "../types";
import useIndianCurrency from "../hooks/useIndianCurrency";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";

function isValidNumber(input: string) {
  const number = Number(input);
  return !isNaN(number) && isFinite(number);
}

const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear();

interface IBudgetProps {
  summary: ISummary;
}

const initalBudget: IBudget = {
  forMonth: "",
  limit: 0,
};

const API = import.meta.env.VITE_USER_API_URL || "http://localhost:8080/user";

const Budget = memo(({ summary }: IBudgetProps) => {
  const [budget, setBudget] = useState<IBudget>(initalBudget);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typeError, setTypeError] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [availableBudget, setAvailableBudget] = useState<number>(0);

  const fetchBudget = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API}/getBudget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.data != null) {
        setBudget(res.data.data);
        setMonthlyBudget(res.data.data.limit);
        setAvailableBudget(res.data.data.limit - summary.thisMonth[1]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [summary.thisMonth]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const handleSubmit = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.post(
        `${API}/newBudget`,
        { ...budget, forMonth: currentMonth + " " + currentYear },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBudget(res.data.data);
      setMonthlyBudget(res.data.data.limit);
      setAvailableBudget(res.data.data.limit - summary.thisMonth[1]);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  }, [budget, summary.thisMonth]);

  const handleDelete = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.delete(`${API}/${budget.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudget(initalBudget);
    } catch (error) {
      console.log(error);
    }
  }, [budget.id]);

  const formattedMonthlyBudget = useIndianCurrency(monthlyBudget ?? 0);
  const formattedMothlySpendings = useIndianCurrency(summary.thisMonth[1]);
  const formattedAvailableBudget = useIndianCurrency(availableBudget);

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeError(
      !isValidNumber(event.target.value) ? "limit should be numeric" : ""
    );
    if (budget && isValidNumber(event.target.value))
      setBudget({ ...budget, limit: Number(event.target.value) });
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      {budget?.forMonth === "" ? (
        <div className="flex flex-col items-center">
          <h3 className="text-xl text-gray-300">
            Set up your budget for {currentMonth} {currentYear}
          </h3>
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            Set up Budget
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-gray-300">
              Budget for {currentMonth} {currentYear}
            </h3>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 hover:text-blue-600 transition-all"
            >
              Edit
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-3">
              <p>Budget:</p>
              <p className="font-semibold text-gray-100">
                {formattedMonthlyBudget}
              </p>
            </div>
            <div className="flex justify-between items-center text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-3">
              <p>Spent:</p>
              <p className="font-semibold text-gray-100">
                {formattedMothlySpendings}
              </p>
            </div>
            <div className="flex justify-between items-center text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-3">
              <p>Available:</p>
              <p
                className={`font-semibold ${
                  availableBudget >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formattedAvailableBudget}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Delete Budget
          </Button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Set Your Budget
            </h3>
            <Input
              labelClassName="block text-sm font-medium text-gray-700"
              type="text"
              value={budget?.limit}
              placeHolder="Enter your budget"
              onChange={handleBudgetChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              id="budget"
              label=""
            />
            {typeError && (
              <p className="mt-1 text-sm text-red-500">
                Budget should be numeric
              </p>
            )}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg transition-all ${
                  typeError
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Finish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Budget;
