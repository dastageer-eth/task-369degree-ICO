import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { USDTAddresses, USDCAddresses } from "../constants/constant";

const bnbLogo = "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg";
const usdtLogo = "https://cryptologos.cc/logos/tether-usdt-logo.svg";
const usdcLogo = "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg";

const BalanceCard: React.FC = () => {
  const { address: accountAddress, chain: chain } = useAccount();
  const [chainName, setChainName] = useState<string | undefined>();
  const { data: balanceData } = useBalance({
    address: accountAddress,
  });

  function getUSDTByNetwork(network: string): string | undefined {
    const entry = USDTAddresses.find(([key]) => key === network);
    return entry?.[1];
  }

  function getUSDCByNetwork(network: string): string | undefined {
    const entry = USDCAddresses.find(([key]) => key === network);
    return entry?.[1];
  }

  const { data: usdtBalanceData } = useBalance({
    address: accountAddress,
    // @ts-expect-error: Object is possibly 'null'.
    token: getUSDTByNetwork(chainName), // USDT Token address
  });
  const { data: usdcBalanceData } = useBalance({
    address: accountAddress,
    // @ts-expect-error: Object is possibly 'null'.
    token: getUSDCByNetwork(chainName), // USDC Token address
  });

  useEffect(() => {
    console.log("called");
    setChainName(chain?.name);
    console.log(`Account address: ${accountAddress}`);
    console.log(`Chain name: ${chain?.name}`);
  }, [accountAddress, chain]);

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
