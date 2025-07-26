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
      <label className="text-[#dddad0]/70 text-sm">{label}</label>
      <button
        onClick={onClick}
        className="w-full bg-[#57564f]/50 hover:bg-[#7a7a73]/50 border border-[#7a7a73] rounded-xl p-4 flex items-center justify-between transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#dddad0] to-[#f8f3ce] flex items-center justify-center">
                <span className="text-[#57564f] font-bold text-sm">{selectedToken.symbol.charAt(0)}</span>
              </div>
              <div className="text-left">
                <div className="text-[#f8f3ce] font-medium">{selectedToken.symbol}</div>
                <div className="text-[#dddad0]/70 text-sm">{selectedToken.chain}</div>
              </div>
            </>
          ) : (
            <div className="text-[#dddad0]/70">{placeholder}</div>
          )}
        </div>
        <ChevronDown className="text-[#dddad0]/70 group-hover:text-[#f8f3ce] transition-colors" size={20} />
      </button>
    </div>
  );
};