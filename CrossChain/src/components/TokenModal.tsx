import React, { useState } from 'react';
import { X, Search, Circle } from 'lucide-react';

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
  { id: 'eth', name: 'ETH', logo: '', color: 'border-[#dddad0]' },
  { id: 'arb', name: 'ARB', logo: '', color: 'border-[#f8f3ce]' },
  { id: 'base', name: 'BASE', logo: '', color: 'border-[#dddad0]' },
  { id: 'sui', name: 'SUI', logo: '', color: 'border-[#f8f3ce]' },
  { id: 'bsc', name: 'BSC', logo: '', color: 'border-[#dddad0]' },
  { id: 'other', name: 'other', logo: '', color: 'border-[#7a7a73]' }
];

const tokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'ETH',
    logo: '',
    balance: '0.000873',
    usdValue: '$3.27'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '',
    balance: '1,234.56',
    usdValue: '$1,234.56'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logo: '',
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
    <div className="fixed inset-0 bg-[#57564f]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#57564f] rounded-2xl w-full max-w-xs max-h-[70vh] overflow-hidden border border-[#7a7a73]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#7a7a73]">
          <div>
            <h2 className="text-[#f8f3ce] text-base font-semibold">Select a network</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[#dddad0]/70 text-xs">From</span>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#dddad0] to-[#f8f3ce] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#57564f]/20"></div>
                </div>
                <span className="text-[#dddad0] text-xs font-mono">0x6532...4ff5</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Network Selection */}
        <div className="p-3 border-b border-[#7a7a73]">
          <div className="grid grid-cols-2 gap-1.5">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedNetwork.id === network.id
                    ? `${network.color} bg-[#7a7a73]/50`
                    : 'border-[#7a7a73] hover:border-[#dddad0] bg-[#7a7a73]/30'
                }`}
              >
                {network.id === 'other' ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7a7a73] flex items-center justify-center">
                      <span className="text-[#f8f3ce] text-lg">+</span>
                    </div>
                    <span className="text-[#f8f3ce] text-xs font-medium">{network.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#dddad0] to-[#f8f3ce] flex items-center justify-center">
                      <span className="text-[#57564f] font-bold text-xs">{network.name.charAt(0)}</span>
                    </div>
                    <span className="text-[#f8f3ce] text-xs font-medium">{network.name}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Token Selection */}
        <div className="p-3 flex flex-col h-full">
          <h3 className="text-[#f8f3ce] text-sm font-semibold mb-2">Select a token</h3>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#dddad0]/70" size={16} />
            <input
              type="text"
              placeholder="Search for a token or paste an address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#7a7a73]/50 border border-[#dddad0]/50 rounded-full py-2 pl-10 pr-3 text-sm text-[#f8f3ce] placeholder-[#dddad0]/50 focus:outline-none focus:border-[#f8f3ce] transition-colors"
            />
          </div>

          {/* Token List */}
          <div className="flex-1 overflow-hidden">
            <h4 className="text-[#dddad0]/70 text-xs mb-2">Tokens on {selectedNetwork.name}</h4>
            <div className="h-32 overflow-y-auto space-y-1 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#7a7a73 transparent' }}>
              {filteredTokens.map((token, index) => (
                <button
                  key={index}
                  onClick={() => onSelectToken(token, selectedNetwork)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#7a7a73]/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#dddad0] to-[#f8f3ce] flex items-center justify-center">
                      <span className="text-[#57564f] font-bold text-xs">{token.symbol.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-[#f8f3ce] text-xs font-medium">{token.symbol}</div>
                      <div className="text-[#dddad0]/70 text-xs">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#f8f3ce] text-xs font-medium">{token.balance}</div>
                    <div className="text-[#dddad0]/70 text-xs">{token.usdValue}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-3 border-t border-[#7a7a73]">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#7a7a73] via-[#57564f] to-[#7a7a73] hover:from-[#dddad0] hover:via-[#7a7a73] hover:to-[#dddad0] text-[#f8f3ce] font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg text-sm"
          >
            Connect destination wallet
          </button>
        </div>
      </div>
    </div>
  );
};