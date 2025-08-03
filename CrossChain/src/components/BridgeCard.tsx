import React, { useState } from "react";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import { TokenSelector } from "./TokenSelector";
import { TokenModal } from "./TokenModal";
import { getOrderHashFunction } from "../utils/OrderHash";
import { convertToTokenAmount, getImmutables } from "../utils/helper";
import { useAccount } from "wagmi";
import { useWriteInitiateSwapWithLOP } from "../hooks/writecontracts";
import { keccak256, toHex } from "viem";

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
  const account = useAccount();
  const { InitiateSwapWithLOP } = useWriteInitiateSwapWithLOP();
  const userAddress = account.address;
  const [fromToken, setFromToken] = useState<Token | undefined>({
    symbol: "ETH",
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    chain: "Ethereum",
  });
  const [toToken, setToToken] = useState<Token | undefined>({
    symbol: "MON",
    name: "Monad",
    logo: "https://cryptologos.cc/logos/monad-logo.png",
    chain: "Monad",
  });
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"from" | "to">("from");

  const handleTokenSelect = (token: any, network: Network) => {
    const selectedToken = {
      ...token,
      chain: network.name,
    };

    if (modalType === "from") {
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

  const openModal = (type: "from" | "to") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCrossChain = async (
    tokenSelect: string,
    userSellAmount: string
  ) => {
    const exchangeRate = 0.95;
    const userBuyAmount = (
      parseFloat(userSellAmount) * exchangeRate
    ).toString();
    const makingAmount = convertToTokenAmount(userSellAmount);
    const takingAmount = convertToTokenAmount(userBuyAmount);

    const swapId = keccak256(toHex(Date.now().toString())); // or generate securely
    const secret = keccak256(toHex("some-random-secret")); // H(secret) = secretHash
    const secretHash = secret;

    const timelock = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour later
    const isInitiatorSide = true;

    // Replace with real addresses
    const tokenA = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const tokenB = "0xC78026eB00FCaE349F9b09A03687d51dD77A2733";
    const participant = userAddress as `0x${string}`;

    const {
      orderData, // plain object
      orderHash,
    } = await getOrderHashFunction(
      tokenSelect === "Ethereum" ? "sepolia-to-monad" : "monad-to-sepolia",
      makingAmount,
      takingAmount,
      userAddress
    );

    const r = keccak256(toHex("r")).slice(0, 66);
    const vs = keccak256(toHex("vs")).slice(0, 66);
    const takerTraits = 0n;
    const args = "0x";

    console.log("orderData.salt:", typeof orderData.salt, orderData.salt);
    console.log(
      "orderData.makingAmount:",
      typeof orderData.makingAmount,
      orderData.makingAmount
    );
    console.log(
      "orderData.takingAmount:",
      typeof orderData.takingAmount,
      orderData.takingAmount
    );
    console.log(
      "orderData.makerTraits:",
      typeof orderData.makerTraits,
      orderData.makerTraits
    );

    try {
      const tx = await InitiateSwapWithLOP(
        swapId,
        participant,
        tokenA,
        tokenB,
        makingAmount,
        takingAmount,
        secretHash,
        timelock,
        isInitiatorSide,
        orderData,
        r,
        vs,
        takerTraits,
        args
      );
      console.log("tx:", tx);
    } catch (err) {
      console.error("Swap failed", err);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-[#57564f]/60 backdrop-blur-md border border-[#7a7a73]/50 rounded-2xl p-6 shadow-2xl">
        {/* From Section */}
        <div className="space-y-4">
          <TokenSelector
            label="From"
            selectedToken={fromToken}
            placeholder="Select token"
            onClick={() => openModal("from")}
          />

          {/* Swap Button */}
          <div className="flex justify-center relative">
            <button
              onClick={handleSwapTokens}
              className="absolute -top-2 bg-gradient-to-r from-[#7a7a73] to-[#57564f] hover:from-[#dddad0] hover:to-[#7a7a73] border border-[#dddad0]/50 rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-180 z-10 shadow-lg"
            >
              <ArrowUpDown className="text-[#f8f3ce]" size={18} />
            </button>
            <div className="w-full h-px bg-[#7a7a73] mt-2"></div>
          </div>

          {/* To Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#dddad0]/70 text-sm">To</span>
              <button className="text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors">
                <RotateCcw size={16} />
              </button>
            </div>
            <TokenSelector
              label=""
              selectedToken={toToken}
              placeholder="Select token"
              onClick={() => openModal("to")}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2 pt-4">
            <label className="text-[#dddad0]/70 text-sm">Amount</label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-[#57564f]/50 border border-[#7a7a73] rounded-xl p-4 text-[#f8f3ce] text-lg focus:outline-none focus:border-[#dddad0] transition-colors pr-16 placeholder-[#dddad0]/50"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#dddad0]/70 hover:text-[#f8f3ce] transition-colors text-sm font-medium">
                Max
              </button>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={() =>
              fromToken?.name && handleCrossChain(fromToken.name, amount)
            }
            className="w-full bg-gradient-to-r from-[#7a7a73] via-[#57564f] to-[#7a7a73] hover:from-[#dddad0] hover:via-[#7a7a73] hover:to-[#dddad0] text-[#f8f3ce] font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] mt-6 shadow-lg"
          >
            Swap
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
