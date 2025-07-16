import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from './OrdersTable';
import { useOrders } from '@/hooks/useOrders';

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  const { openOrders, orderHistory, isLoading, error } = useOrders();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="open">Open Orders</TabsTrigger>
        <TabsTrigger value="history">Order History</TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        <OrdersTable orders={openOrders} isLoading={isLoading} error={error} />
      </TabsContent>
      <TabsContent value="history">
        <OrdersTable orders={orderHistory} isLoading={isLoading} error={error} />
      </TabsContent>
    </Tabs>
  );
};

export default OrderTabs;
