import React, { useEffect } from "react";
import { useAccount, useBalance } from "wagmi";

const bnbLogo = "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg";
const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.svg";
const usdcLogo = "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg";

const BalanceCard: React.FC = () => {
  const { address: accountAddress } = useAccount();
  const { data: balanceData } = useBalance({
    address: accountAddress,
  });

  const { data: usdtBalanceData } = useBalance({
    address: accountAddress,
    token: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", // USDT Token address
  });
  const { data: usdcBalanceData } = useBalance({
    address: accountAddress,
    token: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC Token address
  });

  useEffect(() => {
    console.log("called");
    console.log(`Account address: ${accountAddress}`);
  }, [accountAddress]);

  const formatBalance = (balance: string | undefined) => {
    return balance ? parseFloat(balance).toFixed(2) : "0.00";
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center mb-6 bg-opacity-90 backdrop-filter backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Balances</h2>
      <div className="flex justify-around">
        <div className="flex items-center space-x-2">
          <img src={bnbLogo} alt="BNB" className="w-8 h-8" />
          <div>
            <span className="text-lg font-medium">BNB</span>
            <p className="text-gray-600">
              {formatBalance(balanceData?.formatted)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <img src={usdtLogo} alt="USDT" className="w-8 h-8" />
          <div>
            <span className="text-lg font-medium">USDT</span>
            <p className="text-gray-600">
              {formatBalance(usdtBalanceData?.formatted)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <img src={usdcLogo} alt="USDC" className="w-8 h-8" />
          <div>
            <span className="text-lg font-medium">USDC</span>
            <p className="text-gray-600">
              {formatBalance(usdcBalanceData?.formatted)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
