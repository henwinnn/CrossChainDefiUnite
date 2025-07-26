import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface Network {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface Token {
  symbol: string;
  name: string;
  logo: string;
  balance: string;
  usdValue: string;
}

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token, network: Network) => void;
}

const networks: Network[] = [
  { id: 'eth', name: 'ETH', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', color: 'border-purple-500' },
  { id: 'arb', name: 'ARB', logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', color: 'border-blue-500' },
  { id: 'base', name: 'BASE', logo: 'https://cryptologos.cc/logos/coinbase-coin-logo.png', color: 'border-blue-600' },
  { id: 'sui', name: 'SUI', logo: 'https://cryptologos.cc/logos/sui-sui-logo.png', color: 'border-cyan-500' },
  { id: 'bsc', name: 'BSC', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', color: 'border-yellow-500' },
  { id: 'other', name: 'other', logo: '', color: 'border-gray-500' }
];

const tokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: '0.000873',
    usdValue: '$3.27'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: '1,234.56',
    usdValue: '$1,234.56'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: '0.5432',
    usdValue: '$2,156.78'
  }
];

export const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSelectToken }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-sm max-h-[85vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-white text-lg font-semibold">Select a network</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-400 text-sm">From</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/20"></div>
                </div>
                <span className="text-gray-300 text-sm font-mono">0x6532...4ff5</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Network Selection */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedNetwork.id === network.id
                    ? `${network.color} bg-gray-800/50`
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                }`}
              >
                {network.id === 'other' ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                      <span className="text-xl">+</span>
                    </div>
                    <span className="text-white text-xs font-medium">{network.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={network.logo}
                      alt={network.name}
                      className="w-10 h-10 rounded-lg"
                    />
                    <span className="text-white text-xs font-medium">{network.name}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Token Selection */}
        <div className="p-4">
          <h3 className="text-white text-base font-semibold mb-3">Select a token</h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for a token or paste an address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-indigo-500/50 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Token List */}
          <div className="space-y-1">
            <h4 className="text-gray-400 text-xs mb-2">Tokens on {selectedNetwork.name}</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredTokens.map((token, index) => (
                <button
                  key={index}
                  onClick={() => onSelectToken(token, selectedNetwork)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{token.symbol}</div>
                      <div className="text-gray-400 text-xs">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{token.balance}</div>
                    <div className="text-gray-400 text-xs">{token.usdValue}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            Connect destination wallet
          </button>
        </div>
      </div>
    </div>
  );
};