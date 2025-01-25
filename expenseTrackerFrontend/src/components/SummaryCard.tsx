import useIndianCurrency from "../hooks/useIndianCurrency";

interface SummaryCardProps {
  title: string;
  amount: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount }) => {
  const cardStyle = title === "Income" ? "bg-green-600" : "bg-red-500";
  const formattedAmount = useIndianCurrency(amount);
  return (
    <div
      className={`${cardStyle} text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow`}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{formattedAmount}</p>
    </div>
  );
};

export default SummaryCard;
