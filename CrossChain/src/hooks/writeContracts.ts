import { useWriteContract } from "wagmi";
import CrossChainSMAbi from "../abi/CrossChainSMABI.json"; // You need to provide the ABI

export const useWriteInitiateSwapWithLOP = () => {
  const { data: hash, error, writeContractAsync } = useWriteContract();

  const InitiateSwapWithLOP = (
    swapId: string,
    participant: `0x${string}`,
    tokenA: `0x${string}`,
    tokenB: `0x${string}`,
    amountA: bigint,
    amountB: bigint,
    secretHash: string,
    timelock: bigint,
    isInitiatorSide: boolean,
    order: {
      salt: bigint;
      maker: `0x${string}`;
      receiver: `0x${string}`;
      makerAsset: `0x${string}`;
      takerAsset: `0x${string}`;
      makingAmount: bigint;
      takingAmount: bigint;
      makerTraits: bigint;
    },
    r: string,
    vs: string,
    takerTraits: bigint,
    args: `0x${string}`
  ) => {
    return writeContractAsync({
      address: "0x053254f16e804F5c675D7c26E01EdD8042F4D38E",
      abi: CrossChainSMAbi,
      functionName: "initiateSwapWithLOP",
      args: [
        swapId,
        participant,
        tokenA,
        tokenB,
        amountA,
        amountB,
        secretHash,
        timelock,
        isInitiatorSide,
        order,
        r,
        vs,
        takerTraits,
        args,
      ],
    });
  };

  return { hash, InitiateSwapWithLOP, error };
};
