import Heading from "@/components/heading";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CreditCard, DollarSign, Package} from "lucide-react";
import {formatter} from "@/lib/utils";
import {getTotalRevenue} from "./actions/get-total-revenue";
import {getSalesCount} from "./actions/get-total-sales";
import {getStockCount} from "./actions/get-total-products";
import Overview from "@/components/overview";
import {getRevenue} from "./actions/get-revenue";

export default async function Home() {
  const totalRevenue = await getTotalRevenue();
  const totalSales = await getSalesCount();
  const totalProducts = await getStockCount();

  const revenue = await getRevenue();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">
                Products In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={revenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
