
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCardProps {
  referralCode: string;
  totalEarnings: number;
  referrals: number;
}

const ReferralCard = ({ referralCode, totalEarnings, referrals }: ReferralCardProps) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    const referralLink = `https://wa.me/254700363422?text=REF${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Share it with your friends to earn rewards",
    });
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Your Referral Code</h3>
        <div className="text-2xl font-mono text-primary">{referralCode}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary">
            Ksh {totalEarnings.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Earnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-primary">{referrals}</div>
          <div className="text-sm text-muted-foreground">Total Referrals</div>
        </div>
      </div>

      <Button onClick={handleCopyLink} className="w-full gap-2">
        <Share2 className="h-4 w-4" />
        Share Referral Link
      </Button>
    </Card>
  );
};

export default ReferralCard;
