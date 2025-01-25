import React from "react";
import { ITransactionItem } from "../types";
import TransactionItem from "./TransactionItem";

interface ITransactionsListProps {
  transactions: ITransactionItem[];
  className: string;
}

const TransactionsList: React.FC<ITransactionsListProps> = ({
  transactions,
  className,
}) => {
  return (
    <div className={className}>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <p className="text-gray-500">No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionsList;
