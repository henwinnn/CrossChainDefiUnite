import { SDK } from "@1inch/cross-chain-sdk";

export default async function handler(req, res) {
  const sdk = new SDK({
    url: "https://api.1inch.dev/fusion-plus",
    authKey: "NrwEHpy4jZn0IiZgQpcTdPANC8tHynyK",
  });

  try {
    const orders = await sdk.getOrdersByMaker({
      page: 1,
      limit: 2,
      address: "0x1119260c3F217fb80266A4b0b5945C7e2a5ad6a1",
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}
