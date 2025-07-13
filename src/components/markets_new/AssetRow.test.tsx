import React from 'react';
import { render, screen } from '@testing-library/react';
import AssetRow from './AssetRow';
import { MarketData } from '../../../supabase/functions/get-market-data-new/types';

const mockAsset: MarketData = {
  symbol: 'TEST',
  name: 'Test Asset',
  live_price: 100,
  buy_price: 100.025,
  sell_price: 99.975,
  change_percent_24h: 2.5,
  volume: 123456,
};

const mockNegativeAsset: MarketData = {
    ...mockAsset,
    symbol: 'NEG',
    name: 'Negative Asset',
    change_percent_24h: -1.5,
}

describe('AssetRow', () => {
  it('renders asset information correctly', () => {
    render(<table><tbody><AssetRow asset={mockAsset} /></tbody></table>);

    expect(screen.getByText('Test Asset')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('100.0250')).toBeInTheDocument();
    expect(screen.getByText('99.9750')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
  });

  it('applies green color for positive change', () => {
    render(<table><tbody><AssetRow asset={mockAsset} /></tbody></table>);
    const changeElement = screen.getByText('+2.50%');
    expect(changeElement).toHaveClass('text-green-400');
  });

  it('applies red color for negative change', () => {
    render(<table><tbody><AssetRow asset={mockNegativeAsset} /></tbody></table>);
    const changeElement = screen.getByText('-1.50%');
    expect(changeElement).toHaveClass('text-red-400');
  });
});