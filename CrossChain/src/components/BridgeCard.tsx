import React, { useState } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { TokenModal } from './TokenModal';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  chain: string;
}

interface Network {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export const BridgeCard: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token | undefined>({
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    chain: 'Ethereum'
  });
  const [toToken, setToToken] = useState<Token | undefined>({
    symbol: 'SOL',
    name: 'Solana',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    chain: 'Solana'
  });
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'from' | 'to'>('from');

  const handleTokenSelect = (token: any, network: Network) => {
    const selectedToken = {
      ...token,
      chain: network.name
    };
    
    if (modalType === 'from') {
      setFromToken(selectedToken);
    } else {
      setToToken(selectedToken);
    }
    setIsModalOpen(false);
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const openModal = (type: 'from' | 'to') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-slate-800/40 backdrop-blur-md border border-gray-600/30 rounded-2xl p-6 shadow-2xl">
        {/* From Section */}
        <div className="space-y-4">
          <TokenSelector
            label="From"
            selectedToken={fromToken}
            placeholder="Select token"
            onClick={() => openModal('from')}
          />

          {/* Swap Button */}
          <div className="flex justify-center relative">
            <button
              onClick={handleSwapTokens}
              className="absolute -top-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-indigo-500/50 rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-180 z-10 shadow-lg"
            >
              <ArrowUpDown className="text-white" size={18} />
            </button>
            <div className="w-full h-px bg-gray-700 mt-2"></div>
          </div>

          {/* To Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">To</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <RotateCcw size={16} />
              </button>
            </div>
            <TokenSelector
              label=""
              selectedToken={toToken}
              placeholder="Select token"
              onClick={() => openModal('to')}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2 pt-4">
            <label className="text-gray-400 text-sm">Amount</label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-purple-500 transition-colors pr-16"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Max
              </button>
            </div>
          </div>

          {/* Connect Button */}
          <button className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] mt-6 shadow-lg">
            Connect destination wallet
          </button>
        </div>
      </div>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectToken={handleTokenSelect}
      />
    </>
  );
};