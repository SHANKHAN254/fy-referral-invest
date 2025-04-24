
import { Card } from "@/components/ui/card";
import { CircleCheck, Star } from "lucide-react";

interface InvestmentStatsProps {
  totalInvestments: number;
  activeInvestments: number;
  totalReturns: number;
}

const InvestmentStats = ({ totalInvestments, activeInvestments, totalReturns }: InvestmentStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">Total Investments</h3>
        </div>
        <p className="text-2xl font-semibold">Ksh {totalInvestments.toLocaleString()}</p>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <CircleCheck className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">Active Investments</h3>
        </div>
        <p className="text-2xl font-semibold">{activeInvestments}</p>
      </Card>

      <Card className="p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">Total Returns</h3>
        </div>
        <p className="text-2xl font-semibold">Ksh {totalReturns.toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default InvestmentStats;
