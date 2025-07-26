import React from 'react';
import { Twitter, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          Privacy Policy
        </button>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          FAQs
        </button>
      </div>
      
      <div className="flex space-x-4">
        <button className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors">
          <Twitter size={20} className="text-[#dddad0]/70 hover:text-[#f8f3ce]" />
        </button>
        <button className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors">
          <MessageCircle size={20} className="text-[#dddad0]/70 hover:text-[#f8f3ce]" />
        </button>
      </div>
    </footer>
  );
};