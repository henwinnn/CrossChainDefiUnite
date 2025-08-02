export function convertToTokenAmount(amount: string): bigint {
  const amountFloat = parseFloat(amount);
  // const multiplier = 1_000_000_000_000_000_000n; // 10^18
  return BigInt(Math.floor(amountFloat * 1e18));
}

export function getImmutables(
  orderHash: any,
  hashlock: any,
  maker: any,
  taker: any,
  token: any,
  amount: bigint,
  safetyDeposit: bigint,
  timelocks: number
) {
  return {
    orderHash: orderHash,
    hashlock: hashlock,
    maker: maker,
    taker: taker,
    token: token,
    amount: amount,
    safetyDeposit: safetyDeposit,
    timelocks: timelocks,
  };
}
