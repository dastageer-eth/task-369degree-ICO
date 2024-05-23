import React from "react";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Success</h1>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
