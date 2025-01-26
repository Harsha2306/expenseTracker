import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import TransactionsList from "../components/TransactionsList";
import { ITransactionItem } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import useIsAuthorized from "../hooks/useIsAuthorized";
import { Link, useNavigate } from "react-router";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Logout from "../components/Logout";

const LIMIT = 5;
const API = import.meta.env.VITE_USER_API_URL || "http://localhost:8080/user";

const AllTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransactionItem[]>([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigateTo = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc");
  const [filterValue, setFilterValue] = useState("all");
  const [limit, setLimit] = useState(LIMIT);
  const filters = ["all", "income", "expense"];

  useIsAuthorized();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setLimit(LIMIT);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(e.target.value);
    setLimit(LIMIT);
  };

  const handleSortTypeChange = () =>
    setSortOrder(sortOrder === "asc" ? "dsc" : "asc");

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setIsLoading(true);
      const response = await axios.get(
        `${API}/allTransactions?search=${debouncedValue}&sortField=${sortBy}&sortOrder=${sortOrder}&limit=${limit}&type=${filterValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data.data.transactions);
      setHasMoreTransactions(response.data.data.hasMoreTransactions);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        navigateTo("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [debouncedValue, filterValue, limit, navigateTo, sortBy, sortOrder]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8 flex justify-center">
      <Logout />
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 transition-all flex items-center space-x-2"
          >
            <span>Return to Home</span>
          </Link>
        </div>

        <SearchBar
          sortOrder={sortOrder}
          handleSortTypeChange={handleSortTypeChange}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TransactionsList
              transactions={transactions}
              className="bg-gray-800 rounded-lg shadow p-4"
            />
            {hasMoreTransactions && (
              <Button
                type="button"
                className="w-full mt-2 text-gray-400 hover:text-gray-300 px-6 py-2 rounded-lg bg-gray-700 transition-all cursor-pointer"
                onClick={() => setLimit((prev) => prev + LIMIT)}
              >
                Load more
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsPage;
