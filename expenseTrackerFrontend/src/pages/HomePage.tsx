import React, { useState, useEffect, useCallback } from "react";
import Greeting from "../components/Greeting";
import FilterOptions from "../components/FilterOptions";
import SummaryCard from "../components/SummaryCard";
import RecentTransactionsList from "../components/RecentTransactionsList";
import { ISummary, ITransactionItem } from "../types";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import useIsAuthorized from "../hooks/useIsAuthorized";
import { useNavigate } from "react-router";
import Budget from "../components/Budget";
import Logout from "../components/Logout";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/user";

const HomePage: React.FC = () => {
  const [filter, setFilter] = useState<keyof ISummary>("thisMonth");
  const [summary, setSummary] = useState<ISummary>({
    allTime: [0, 0],
    thisMonth: [0, 0],
    year: [0, 0],
  });
  const [recentTransactions, setRecentTransactions] = useState<
    ITransactionItem[]
  >([]);
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoding] = useState(false);
  const navigateTo = useNavigate();

  useIsAuthorized();

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoding(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${API}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { fullName, incomesExpenses, recentTransactions } =
        response.data.data;
      setFullName(fullName);
      setRecentTransactions(recentTransactions);
      setSummary(incomesExpenses);
    } catch (error) {
      if (error.status === 401) {
        navigateTo("/login");
      }
    } finally {
      setIsLoding(false);
    }
  }, [navigateTo]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8 relative">
      <Logout/>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-4xl mx-auto mt-5">
          <Greeting username={fullName} />
          <FilterOptions filter={filter} setFilter={setFilter} />
          <div className="grid grid-cols-2 gap-6 my-6">
            <SummaryCard title="Income" amount={summary[`${filter}`][0]} />
            <SummaryCard title="Spending" amount={summary[`${filter}`][1]} />
          </div>
          <RecentTransactionsList transactions={recentTransactions} />
          <Budget summary={summary} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
