import React from 'react';

function AddGameButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-blue-500 group flex flex-col items-center justify-center min-h-[200px]"
    >
      <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors mb-3">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <span className="text-gray-600 group-hover:text-blue-600 font-medium transition-colors">
        Add Live Game
      </span>
    </button>
  );
}

export default AddGameButton;
