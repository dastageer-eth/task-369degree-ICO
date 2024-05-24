import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import SuccessMessage from "../components/SuccessMessage";

// Mock function to simulate fetching balance from a blockchain or an API

const Invest: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>("buy");
  const [currency, setCurrency] = useState<string>("BNB");
  const [amount, setAmount] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const bnbLogo = "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg";
  const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.svg";
  const usdcLogo = "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg";

  const handleTransactionTypeChange = (type: string) => {
    setTransactionType(type);
    console.log(`Transaction Type: ${type}`);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
    console.log(`Currency: ${currency}`);
  };

  const handleInvestClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Amount must be greater than zero.");
      return;
    }

    console.log(`Transaction Type: ${transactionType}`);
    console.log(`Currency: ${currency}`);
    console.log(`Amount: ${amount}`);

    const message =
      transactionType === "buy"
        ? `You have successfully bought ${amount} token using ${currency}.`
        : `You have successfully sold ${amount} token in exchange of${currency}.`;

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
        <div>
          <BalanceCard />
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center bg-opacity-90 backdrop-filter backdrop-blur-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {transactionType === "buy"
                ? "Invest in Our ICO"
                : "Sell Your Tokens"}
            </h1>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => handleTransactionTypeChange("buy")}
                className={`px-4 py-2 rounded-l-full ${
                  transactionType === "buy"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition duration-300 ease-in-out hover:bg-blue-600`}
              >
                Buy
              </button>
              <button
                onClick={() => handleTransactionTypeChange("sell")}
                className={`px-4 py-2 rounded-r-full ${
                  transactionType === "sell"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition duration-300 ease-in-out hover:bg-blue-600`}
              >
                Sell
              </button>
            </div>
            <div className="mb-6">
              <label
                htmlFor="currency"
                className="block text-gray-700 mb-2 font-medium"
              >
                Select Currency
              </label>
              <div className="flex justify-center space-x-6">
                <div>
                  <input
                    type="radio"
                    id="BNB"
                    name="currency"
                    value="BNB"
                    checked={currency === "BNB"}
                    onChange={() => handleCurrencyChange("BNB")}
                  />
                  <label
                    htmlFor="BNB"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <img src={bnbLogo} alt="BNB" className="w-8 h-8" />
                    <span className="text-lg">BNB</span>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="USDT"
                    name="currency"
                    value="USDT"
                    checked={currency === "USDT"}
                    onChange={() => handleCurrencyChange("USDT")}
                  />
                  <label
                    htmlFor="USDT"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <img src={usdtLogo} alt="USDT" className="w-8 h-8" />
                    <span className="text-lg">USDT</span>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="USDC"
                    name="currency"
                    value="USDC"
                    checked={currency === "USDC"}
                    onChange={() => handleCurrencyChange("USDC")}
                  />
                  <label
                    htmlFor="USDC"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <img src={usdcLogo} alt="USDC" className="w-8 h-8" />
                    <span className="text-lg">USDC</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-gray-700 mb-2 font-medium"
              >
                {transactionType === "buy"
                  ? "Amount to Invest"
                  : "Amount to Sell"}
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <button
              onClick={handleInvestClick}
              className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              {transactionType === "buy" ? "Invest" : "Sell"}
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
    </div>
  );
};

export default Invest;
