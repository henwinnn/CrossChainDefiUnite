"use client";

import {
  LimitOrder,
  MakerTraits,
  Address,
  // Api,
  // getLimitOrderV4Domain,
} from "@1inch/limit-order-sdk";
import { SDK } from "@1inch/cross-chain-sdk";
// import Web3 from "web3";

export async function getOrderHashFunction(
  direction: string,
  makingAmount: bigint,
  takingAmount: bigint,
  userAddress: "0x" | string = "0x" // Default to empty address if not provided
) {
  let makerAsset, takerAsset, networkId;
  if (direction === "sepolia-to-monad") {
    makerAsset = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia
    takerAsset = "0xC78026eB00FCaE349F9b09A03687d51dD77A2733"; // WMON
    networkId = 11155111; // Sepolia ID
  } else {
    makerAsset = "0xC78026eB00FCaE349F9b09A03687d51dD77A2733"; // WMON
    takerAsset = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Sepolia
    networkId = 10143; // Monad ID
  }

  //   const makingAmount = 1_000_000n; // 1 WMON (in 18 decimals)
  //   const takingAmount = 1_000_000_000_000_000_000n; // 1 1INCH (18 decimals) - fixed the number

  const expiresIn = 120; // seconds (using regular number)
  const expiration = Math.floor(Date.now() / 1000) + expiresIn; // regular number

  const makerTraits = new MakerTraits(0n)
    .withExpiration(BigInt(expiration)) // explicit BigInt conversion
    .allowPartialFills()
    .allowMultipleFills();

  const order = new LimitOrder(
    {
      makerAsset: new Address(makerAsset),
      takerAsset: new Address(takerAsset),
      makingAmount,
      takingAmount,
      maker: new Address(userAddress),
      receiver: new Address(userAddress),
      salt: BigInt(Math.floor(Math.random() * 1e8)), // must be unique for each order
    },
    makerTraits
  );

  const sdk = new SDK({
    url: "https://1inch-proxy-dev.vercel.app", // proxy url from https://api.1inch.dev/
    authKey: process.env.AUTH_KEY,
  });

  const orders = await sdk.getOrdersByMaker({
    page: 1,
    limit: 2,
    address: "0x1119260c3F217fb80266A4b0b5945C7e2a5ad6a1",
  });
  console.log("Sdk.orders", sdk);
  console.log("networkId", networkId);
  const orderHash = order.getOrderHash(networkId);
  // console.log("orders", orders);

  return orderHash;
}
