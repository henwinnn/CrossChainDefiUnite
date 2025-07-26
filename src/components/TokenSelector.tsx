import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  logo: string;
  chain: string;
}

interface TokenSelectorProps {
  label: string;
  selectedToken?: Token;
  placeholder: string;
  onClick: () => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  label,
  selectedToken,
  placeholder,
  onClick
}) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm">{label}</label>
      <button
        onClick={onClick}
        className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              <img 
                src={selectedToken.logo} 
                alt={selectedToken.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <div className="text-white font-medium">{selectedToken.symbol}</div>
                <div className="text-gray-400 text-sm">{selectedToken.chain}</div>
              </div>
            </>
          ) : (
            <div className="text-gray-400">{placeholder}</div>
          )}
        </div>
        <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" size={20} />
      </button>
    </div>
  );
};