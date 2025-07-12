import axios from 'axios';
import { Asset } from '@/hooks/useMarketData';

const YAHOO_FINANCE_API_KEY = process.env.YAHOO_FINANCE_API_KEY;

interface YahooQuote {
    longName?: string;
    shortName: string;
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    regularMarketChange: number;
    regularMarketVolume: number;
    marketCap?: number;
    quoteType: string;
}

interface YahooQuoteResponse {
    quoteResponse: {
        result: YahooQuote[];
        error: null | Record<string, unknown>;
    };
}

export async function fetchAssetData(symbol: string): Promise<Asset> {
    const response = await axios.get<YahooQuoteResponse>(`https://yfapi.net/v6/finance/quote`, {
        params: {
            region: 'US',
            lang: 'en',
            symbols: symbol
        },
        headers: {
            'x-api-key': YAHOO_FINANCE_API_KEY
        }
    });
    
    const quote = response.data.quoteResponse.result?.[0];

    if (!quote) {
        throw new Error(`Invalid data structure from Yahoo Finance API for symbol: ${symbol}`);
    }

    // Process response and return Asset object
    return {
        name: quote.longName || quote.shortName,
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        change_percentage: quote.regularMarketChangePercent,
        change: quote.regularMarketChange,
        volume: String(quote.regularMarketVolume),
        market_cap: quote.marketCap ? String(quote.marketCap) : undefined,
        market_type: quote.quoteType.toLowerCase(),
    };
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

export async function fetchHistoricalData(symbol: string, interval: string, range: string): Promise<HistoricalData[]> {
    const response = await axios.get<HistoricalData[]>(`https://yfapi.net/v7/finance/download/${symbol}`, {
        params: {
            interval: interval,
            range: range
        },
        headers: {
            'x-api-key': YAHOO_FINANCE_API_KEY
        }
    });
    
    if (Array.isArray(response.data)) {
        return response.data;
    }
    
    return [];
}
