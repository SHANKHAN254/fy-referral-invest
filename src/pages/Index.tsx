
import QRCodeScanner from "@/components/QRCodeScanner";
import ReferralCard from "@/components/ReferralCard";
import InvestmentStats from "@/components/InvestmentStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">FY'S Investment Bot</h1>
          <p className="text-lg text-muted-foreground">
            Start your investment journey with our WhatsApp bot
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <QRCodeScanner />
          
          <ReferralCard 
            referralCode="FY'S-ABC12"
            totalEarnings={15000}
            referrals={5}
          />

          <div className="w-full max-w-4xl">
            <InvestmentStats 
              totalInvestments={100000}
              activeInvestments={3}
              totalReturns={10000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
