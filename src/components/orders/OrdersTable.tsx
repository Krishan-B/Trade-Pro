import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from '@/hooks/useOrders';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, error }) => {
  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.asset_name}</TableCell>
            <TableCell>{order.type}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{order.price}</TableCell>
            <TableCell>
              <Badge variant={order.status === 'FILLED' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(order.created_at), 'PPpp')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;