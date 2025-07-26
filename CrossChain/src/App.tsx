import { useState } from "react";
import { Header } from "./components/Header";
import { BridgeCard } from "./components/BridgeCard";
import { Footer } from "./components/Footer";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
  appName: "Eth Network App",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect projectId
  chains: [sepolia],
});

const queryClient = new QueryClient();

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-[#57564f] via-[#7a7a73] to-[#57564f] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7a7a73]/20 via-[#57564f]/40 to-[#57564f]"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#dddad0]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f8f3ce]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#dddad0]/5 via-[#f8f3ce]/10 to-[#dddad0]/5 rounded-full blur-3xl"></div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
              <Header
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />

              <main className="flex-1 flex items-center justify-center px-4 py-8">
                <BridgeCard />
              </main>

              <Footer />
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
