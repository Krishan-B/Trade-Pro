import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card, CardHeader } from "@/shared/ui/card";
import { Wallet } from "lucide-react";
import DepositForm from "@/components/wallet/DepositForm";
import WithdrawForm from "@/components/wallet/WithdrawForm";
import BalanceInfo from "@/components/wallet/BalanceInfo";
import TransactionHistory from "@/components/wallet/TransactionHistory";

const WalletPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Deposit or withdraw funds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 h-fit">
            <CardHeader>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>

                <TabsContent value="deposit" className="mt-4 space-y-4">
                  <DepositForm />
                </TabsContent>

                <TabsContent value="withdraw" className="mt-4 space-y-4">
                  <WithdrawForm />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          <BalanceInfo />
        </div>

        <div className="mt-2">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
