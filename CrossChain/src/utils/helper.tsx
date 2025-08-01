export function convertToTokenAmount(amount: string): bigint {
  const amountFloat = parseFloat(amount);
  // const multiplier = 1_000_000_000_000_000_000n; // 10^18
  return BigInt(Math.floor(amountFloat * 1e18));
}
