import { ITransactionItem } from "../types";
import { memo } from "react";
import { Link } from "react-router-dom";
import TransactionsList from "./TransactionsList";

interface TransactionListProps {
  transactions: ITransactionItem[];
}

const RecentTransactionsList: React.FC<TransactionListProps> = memo(
  ({ transactions }) => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
          {transactions.length !== 0 && (
            <Link
              to="/transactions"
              className="text-blue-500 hover:text-blue-400 text-md"
            >
              See All
            </Link>
          )}
        </div>
        <TransactionsList
          transactions={transactions}
          className="bg-gray-800 rounded-lg shadow p-4"
        />
      </div>
    );
  }
);

export default RecentTransactionsList;