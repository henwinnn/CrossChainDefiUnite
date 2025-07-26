import React, { useState } from "react";
import { Header } from "./components/Header";
import { BridgeCard } from "./components/BridgeCard";
import { Footer } from "./components/Footer";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/40 to-pink-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>

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
  );
}

export default App;
