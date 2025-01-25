import React from "react";
import Input from "./Input";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: string;
  handleSortTypeChange: () => void;
  filterValue: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  filters: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  handleSortTypeChange,
  filterValue,
  onFilterChange,
  filters,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="flex items-center space-x-2 w-full sm:w-auto mb-4 sm:mb-0">
        <Input
          labelClassName="block text-sm font-medium text-gray-700"
          id="search"
          label=""
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeHolder="Search transactions..."
          className="w-full sm:w-64 p-2 rounded border bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
        <label htmlFor="filter" className="text-gray-300">
          Sort By:
        </label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 bg-gray-700 text-gray-300 rounded border border-gray-600 focus:ring focus:ring-blue-500"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <img
          onClick={handleSortTypeChange}
          src={`public/icons/${
            sortOrder === "asc" ? "ascending" : "descending"
          }.svg`}
          alt={sortOrder === "asc" ? "Ascending" : "Descending"}
          className="w-5 h-5 ml-2 cursor-pointer"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="filter" className="text-gray-300">
          Filter:
        </label>
        <select
          id="filter"
          value={filterValue}
          onChange={onFilterChange}
          className="p-2 bg-gray-700 text-gray-300 rounded border border-gray-600 focus:ring focus:ring-blue-500"
        >
          {filters.map((filter, index) => (
            <option key={index} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
