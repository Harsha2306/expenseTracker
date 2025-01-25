import { useMemo } from "react";

const useIndianCurrency = (amount: number) => {
  const formattedAmount = useMemo(() => {
    if (typeof amount !== "number") return "";
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  }, [amount]);

  return formattedAmount;
};

export default useIndianCurrency;
