import { SearchIcon } from "lucide-react";
import React from "react";

export const SearchInput = () => {
  return (
    <form className="flex w-full max-w-[500px]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 rounded-l-full pr-12 border focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
