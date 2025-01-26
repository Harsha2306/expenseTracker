import { useCallback, useEffect, useState } from "react";
import { ICategory } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios, { AxiosError } from "axios";
import useIsAuthorized from "../hooks/useIsAuthorized";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import Input from "../components/Input";
import useToastContext from "../hooks/useToastContext";
import Logout from "../components/Logout";

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.response !== undefined;
}

interface ErrorResponse {
  errors: Record<string, string>;
}

const API = import.meta.env.VITE_USER_API_URL || "http://localhost:8080/user";

interface ITransaction {
  amount: number;
  category: { id: string };
  note: string;
  date: string | null;
  type: "income" | "expense";
}

function convertToISOWithOffset(date: Date | null) {
  if (!date) {
    return null;
  }

  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? "+" : "-";

  const isoString = date.toISOString();
  const timeZoneOffset = `${offsetSign}${String(offsetHours).padStart(
    2,
    "0"
  )}:${String(offsetMinutes).padStart(2, "0")}`;

  return isoString.replace("Z", timeZoneOffset);
}

function convertFromISOWithOffset(isoString: string): Date {
  const match = isoString.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})([+-]\d{2}:\d{2})$/
  );

  if (!match) {
    throw new Error("Invalid ISO string format");
  }

  const [_, dateTime, offset] = match;
  const [offsetSign, offsetHours, offsetMinutes] = [
    offset[0],
    parseInt(offset.slice(1, 3), 10),
    parseInt(offset.slice(4), 10),
  ];

  const totalOffsetMilliseconds =
    (offsetHours * 60 + offsetMinutes) *
    60 *
    1000 *
    (offsetSign === "+" ? 1 : -1);

  const utcDate = new Date(dateTime + "Z");
  const localDate = new Date(utcDate.getTime() - totalOffsetMilliseconds);

  return localDate;
}

const TransactionForm: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [transaction, setTransaction] = useState<ITransaction>({
    amount: 0,
    date: convertToISOWithOffset(date),
    note: "",
    category: { id: "" },
    type: "income",
  });
  const [categories, setCategories] = useState<{
    income: ICategory[];
    expense: ICategory[];
  }>({ income: [], expense: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();
  const { transactionId } = useParams();
  const { addToast } = useToastContext();

  useIsAuthorized();

  const fetchTransaction = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      setIsLoading(true);
      const response = await axios.get(`${API}/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { amount, category, date, note, type } = response.data.data;
      setTransaction({
        amount,
        category: { id: category.id },
        date,
        note,
        type,
      });
      setDate(convertFromISOWithOffset(date));
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        navigateTo("/login");
      }
      if (isAxiosError(error) && error.response?.status === 400) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = axiosError.response?.data.errors;
        const errorMessage = errors?.[""] || "An unknown error occurred";
        alert(errorMessage);
        navigateTo("/");
      }
    }
  }, [navigateTo, transactionId]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setIsLoading(true);
      const response = await axios.get(`${API}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(() => {
        const categories = response.data.data;
        setTransaction((prev) => ({
          ...prev,
          category: { id: categories[transaction.type][0].id },
        }));
        return categories;
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        navigateTo("/login");
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigateTo, transaction.type]);

  useEffect(() => {
    fetchCategories();
    if (transactionId) fetchTransaction();
  }, [fetchCategories, fetchTransaction, transactionId]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = !transactionId
        ? await axios.post(`${API}/newTransaction`, transaction, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.put(
            `${API}/editTransaction/${transactionId}`,
            transaction,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      if (!transactionId) navigateTo("/");
      else {
        const { amount, category, date, note, type } = response.data.data;
        setTransaction({
          amount,
          category: { id: category.id },
          date,
          note,
          type,
        });
        setDate(convertFromISOWithOffset(date));
        addToast(`Updated ${transaction.type}`, "success");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        navigateTo("/login");
      }
      console.log(error);
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setIsLoading(true);
      await axios.delete(`${API}/deleteTransaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigateTo("/");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        navigateTo("/login");
      }
      console.log(error);
    }
  }, [navigateTo, transactionId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <Logout />
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <div className="mb-4">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-all flex items-center space-x-2"
            >
              <span>Return to Home</span>
            </Link>
          </div>
          <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-center space-x-6 mb-6">
              <Button
                type="button"
                className={`px-4 py-2 font-semibold rounded-lg ${
                  transaction.type === "income"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                } hover:bg-blue-500 transition-all`}
                onClick={() =>
                  setTransaction((prev) => ({ ...prev, type: "income" }))
                }
              >
                Income
              </Button>
              <Button
                type="button"
                className={`px-4 py-2 font-semibold rounded-lg ${
                  transaction.type === "expense"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300"
                } hover:bg-red-500 transition-all`}
                onClick={() =>
                  setTransaction((prev) => ({ ...prev, type: "expense" }))
                }
              >
                Expense
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-4 flex justify-center">
                <label
                  htmlFor="date"
                  className="mr-2 mt-2 flex text-sm font-medium text-gray-300"
                >
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null) => {
                    setDate(date);
                    if (date) {
                      setTransaction((prev) => ({
                        ...prev,
                        date: convertToISOWithOffset(date),
                      }));
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <Input
                  labelClassName="block text-sm font-medium text-gray-300"
                  label="Amount"
                  className="w-full p-2 rounded border bg-gray-900 text-gray-300 focus:ring-blue-500"
                  value={transaction.amount}
                  onChange={(e) =>
                    setTransaction((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                  placeHolder="Enter amount"
                  type="text"
                  id="amount"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={transaction.category.id}
                  onChange={(e) =>
                    setTransaction((prev) => ({
                      ...prev,
                      category: { id: e.target.value },
                    }))
                  }
                  className="w-full p-2 rounded border bg-gray-900 text-gray-300 focus:ring-blue-500"
                  required
                >
                  {categories &&
                    categories[transaction.type] &&
                    categories[transaction.type].map((category) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <Input
                  label="Note"
                  labelClassName="block text-sm font-medium text-gray-300"
                  type="text"
                  id="note"
                  value={transaction.note ?? "Not specified"}
                  onChange={(e) =>
                    setTransaction((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  placeHolder="Add a note"
                  className="w-full p-2 rounded border bg-gray-900 text-gray-300 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 mt-4 rounded-lg transition-all"
              >
                Save
              </Button>
              {transactionId && (
                <Button
                  onClick={handleDelete}
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 mt-4 rounded-lg transition-all"
                >
                  Delete
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionForm;
