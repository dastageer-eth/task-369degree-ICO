import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bsc, bscTestnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Invest from "./pages/Invest.tsx";
import Stake from "./pages/Stake.tsx";
import Home from "./pages/Home.tsx";
import "./index.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "task-369degree-ICO",
  projectId: "YOUR_PROJECT_ID",
  chains: [bsc, bscTestnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/invest" element={<Invest />} />
              <Route path="/stake" element={<Stake />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
