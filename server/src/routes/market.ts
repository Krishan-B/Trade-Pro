import { Router, Request, Response } from "express";
import MarketDataService from "../services/marketDataService";

const router = Router();
const marketDataService = MarketDataService.getInstance();

// GET /api/market/quote/:symbol - Get real-time quote for a symbol
router.get("/quote/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const quote = await marketDataService.getMarketData(symbol);
    res.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

// GET /api/market/price/:symbol - Get current price for a symbol
router.get("/price/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const price = await marketDataService.getCurrentPrice(symbol);
    res.json({ symbol, price, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// POST /api/market/quotes - Get multiple quotes at once
router.post("/quotes", async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body;
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ error: "Symbols must be an array" });
    }
    
    const quotes = await marketDataService.getMultipleQuotes(symbols);
    res.json(quotes);
  } catch (error) {
    console.error("Error fetching multiple quotes:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

// GET /api/market/historical/:symbol - Get historical data
router.get("/historical/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { period = "1mo" } = req.query;
    
    const historicalData = await marketDataService.getHistoricalData(symbol, period as string);
    res.json({ symbol, period, data: historicalData });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
});

// GET /api/market/info/:symbol - Get asset information
router.get("/info/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const assetInfo = await marketDataService.getAssetInfo(symbol);
    res.json(assetInfo);
  } catch (error) {
    console.error("Error fetching asset info:", error);
    res.status(500).json({ error: "Failed to fetch asset information" });
  }
});

// GET /api/market/popular/:assetClass - Get popular symbols for asset class
router.get("/popular/:assetClass", (req: Request, res: Response) => {
  try {
    const { assetClass } = req.params;
    const symbols = marketDataService.getPopularSymbols(assetClass);
    res.json({ assetClass, symbols });
  } catch (error) {
    console.error("Error fetching popular symbols:", error);
    res.status(500).json({ error: "Failed to fetch popular symbols" });
  }
});

export default router;