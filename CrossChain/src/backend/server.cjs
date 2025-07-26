// --- backend/server.js ---
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.1inch.dev/fusion-plus";

app.use(cors());
app.use(bodyParser.json());

// 1. Get cross-chain quote
app.get("/api/quote", async (req, res) => {
  try {
    const { srcChain, dstChain, srcToken, dstToken, amount } = req.query;

    const { data } = await axios.get(`${BASE_URL}/quoter/v1.0/quote/receive`, {
      params: {
        srcChain,
        dstChain,
        srcTokenAddress: srcToken,
        dstTokenAddress: dstToken,
        amount,
        walletAddress: "0x0000000000000000000000000000000000000000",
        enableEstimate: false,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: "application/json",
      },
    });

    res.json(data);
  } catch (err) {
    console.log(err.response?.data);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 2. Submit signed order
app.post("/api/submit-order", async (req, res) => {
  try {
    const { order, signature } = req.body;
    const { data } = await axios.post(
      `${BASE_URL}/order/v1.0/order/submit`,
      { order, signature },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get order status
app.get("/api/status/:orderHash", async (req, res) => {
  try {
    const { orderHash } = req.params;
    const { data } = await axios.get(
      `${BASE_URL}/order/v1.0/order/status?orderHash=${orderHash}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: "application/json",
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/tokens/:chainId", async (req, res) => {
  try {
    const { chainId } = req.params;
    console.log(`Fetching tokens for chain ${chainId}`); // Add this log

    const { data } = await axios.get(
      `https://api.1inch.dev/swap/v6.1/${chainId}/tokens`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: "application/json",
        },
      }
    );
    res.json(data.tokens);
  } catch (err) {
    console.log({ data });
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
