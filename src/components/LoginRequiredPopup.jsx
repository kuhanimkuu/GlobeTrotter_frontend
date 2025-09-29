import React from "react";

const LoginRequiredPopup = ({ onClose, type = "item" }) => {
  // Map type → readable name
  const typeLabels = {
    flight: "flight",
    hotel: "hotel",
    tour: "tour package",
    car: "car rental",
  };

  const label = typeLabels[type] || "this service";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-4">
          You need to be logged in to book {label}.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredPopup;
