import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SuccessMessage from "../components/SuccessMessage";

const Staking: React.FC = () => {
  const [amountToStake, setAmountToStake] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userBalance = 1000; // Example user balance, you can replace this with actual data

  const handleStakeClick = () => {
    if (!amountToStake || parseFloat(amountToStake) <= 0) {
      setErrorMessage("Amount must be greater than zero.");
      return;
    }

    console.log(`Amount to Stake: ${amountToStake}`);

    const message = `You have successfully staked ${amountToStake} tokens.`;

    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setErrorMessage("");
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?crypto')",
        }}
      >
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center bg-opacity-90 backdrop-filter backdrop-blur-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Stake Your Tokens
          </h1>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Current Balance
            </label>
            <p className="text-lg font-bold text-gray-800">
              {userBalance} Tokens
            </p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="amountToStake"
              className="block text-gray-700 mb-2 font-medium"
            >
              Amount to Stake
            </label>
            <input
              type="number"
              id="amountToStake"
              value={amountToStake}
              onChange={(e) => setAmountToStake(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          <button
            onClick={handleStakeClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Stake
          </button>
        </div>
        {showSuccessMessage && (
          <SuccessMessage
            message={successMessage}
            onClose={handleCloseSuccessMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Staking;
