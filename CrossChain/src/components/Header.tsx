import React from "react";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <header className="w-full px-4 py-6 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center">
        <div className="text-white font-bold text-xl tracking-wider">
          Henshinswap
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <a
          href="#"
          className="text-[#f8f3ce] hover:text-[#dddad0] transition-colors"
        >
          Bridge
        </a>
        <a
          href="#"
          className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
        >
          USDC
        </a>
        <a
          href="#"
          className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
        >
          Explorer
        </a>
        <a
          href="#"
          className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
        >
          Legacy Tools
        </a>
      </nav>

      {/* Wallet Address */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7a7a73] to-[#57564f] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#f8f3ce]/20"></div>
        </div>
        {/* <span className="text-[#dddad0] text-sm font-mono">0x6532...4ff5</span> */}
        <ConnectButton />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-[#f8f3ce]" />
        ) : (
          <Menu size={24} className="text-[#f8f3ce]" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#57564f]/95 backdrop-blur-sm border-t border-[#7a7a73] md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <a
              href="#"
              className="text-[#f8f3ce] hover:text-[#dddad0] transition-colors"
            >
              Bridge
            </a>
            <a
              href="#"
              className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
            >
              USDC
            </a>
            <a
              href="#"
              className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
            >
              Explorer
            </a>
            <a
              href="#"
              className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors"
            >
              Legacy Tools
            </a>
            <div className="flex items-center space-x-3 pt-4 border-t border-[#7a7a73]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7a7a73] to-[#57564f] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#f8f3ce]/20"></div>
              </div>
              <span className="text-[#dddad0] text-sm font-mono">
                0x6532...4ff5
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
