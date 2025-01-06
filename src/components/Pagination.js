import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (direction) => {
    onPageChange(direction);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handlePageChange(-1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-lg text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
