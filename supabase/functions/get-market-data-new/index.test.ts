import { transformYahooData } from './utils.ts';
import { YahooFinanceResponse } from './types.ts';
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";

const mockYahooResponse: YahooFinanceResponse = {
  quoteResponse: {
    result: [
      {
        symbol: 'TEST',
        longName: 'Test Asset',
        regularMarketPrice: 100,
        regularMarketChangePercent: 2.5,
        regularMarketVolume: 123456,
      },
    ],
    error: null,
  },
};

Deno.test('transformYahooData correctly calculates buy and sell prices', () => {
  const transformedData = transformYahooData(mockYahooResponse);
  const asset = transformedData[0];

  assertEquals(asset.symbol, 'TEST');
  assertEquals(asset.name, 'Test Asset');
  assertEquals(asset.live_price, 100);
  assertEquals(asset.buy_price, 100.025);
  assertEquals(asset.sell_price, 99.975);
  assertEquals(asset.change_percent_24h, 2.5);
  assertEquals(asset.volume, 123456);
});