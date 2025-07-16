import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderBook = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Order book data will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default OrderBook;