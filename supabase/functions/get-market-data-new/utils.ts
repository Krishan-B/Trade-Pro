import { MarketData, YahooFinanceResponse, YahooQuote } from './types.ts'

const SPREAD = 0.05;
const YF_API_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';

export async function fetchFromYahoo(symbols: string[]): Promise<YahooFinanceResponse> {
  const symbolsString = symbols.join(',');
  const response = await fetch(`${YF_API_URL}?symbols=${symbolsString}`);
  if (!response.ok) {
    throw new Error(`Yahoo Finance API request failed with status: ${response.status}`);
  }
  return response.json();
}

export function transformYahooData(data: YahooFinanceResponse): MarketData[] {
  const results = data?.quoteResponse?.result;
  if (!results) {
    console.warn('Yahoo Finance response is missing quoteResponse.result', data);
    return [];
  }

  return results.map((asset: YahooQuote) => {
    const live_price = asset.regularMarketPrice ?? 0;
    return {
      symbol: asset.symbol,
      name: asset.longName || asset.shortName || 'N/A',
      live_price: live_price,
      buy_price: live_price + (SPREAD / 2),
      sell_price: live_price - (SPREAD / 2),
      change_percent_24h: asset.regularMarketChangePercent ?? 0,
      volume: asset.regularMarketVolume ?? 0,
    };
  });
}