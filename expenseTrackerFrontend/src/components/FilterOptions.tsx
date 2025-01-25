import { Dispatch, SetStateAction } from "react";
import { ISummary } from "../types";

interface FilterOptionsProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<keyof ISummary>>;
}
const FilterOptions: React.FC<FilterOptionsProps> = ({ filter, setFilter }) => {
  const options: (keyof ISummary)[] = ["thisMonth", "year", "allTime"];

  return (
    <div className="flex items-center gap-4 mb-6">
      <label className="text-lg font-medium text-gray-400">Filter:</label>
      <select
        className="p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 shadow-sm"
        value={filter}
        onChange={(e) => setFilter(e.target.value as keyof ISummary)}
      >
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-200">
            {option === "thisMonth"
              ? "this month"
              : option === "allTime"
              ? "all time"
              : "year"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterOptions;
