import { useNavigate } from "react-router";
import useIndianCurrency from "../hooks/useIndianCurrency";
import { ITransactionItem } from "../types";

interface TransactionItemProps {
  transaction: ITransactionItem;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { id, amount, category, date, type, note } = transaction;
  const { name, iconPath } = category;
  const formattedAmount = useIndianCurrency(amount);
  const navigateTo = useNavigate();

  const handleOnClick = () => {
    navigateTo(`/transaction/${id}`);
  };

  return (
    <div
      onClick={handleOnClick}
      className="flex justify-between items-center border-b border-gray-700 py-3 hover:cursor-pointer hover:bg-gray-800 hover:shadow-lg hover:border-gray-400 transition-all"
    >
      <div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex justify-center items-center hover:bg-gray-400 transition-all">
            <img
              src={`public/${iconPath}.svg`}
              alt="icon"
              className="w-5 h-5"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-200 hover:text-white transition-all">
            {name}
          </h3>
        </div>
        <p className="text-sm text-gray-500 hover:text-gray-300 transition-all">
          {note ?? "Not specified"}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-lg font-bold ${
            type === "income" ? "text-green-400" : "text-red-400"
          } hover:scale-105 transition-transform`}
        >
          {type === "income" ? "+" : "-"}
          {formattedAmount}
        </p>
        <p className="text-sm text-gray-400 hover:text-gray-200 transition-all">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
