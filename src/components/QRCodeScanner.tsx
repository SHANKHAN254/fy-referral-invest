
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Camera, Circle } from "lucide-react";

const QRCodeScanner = () => {
  const { toast } = useToast();

  return (
    <Card className="w-full max-w-md p-6 shadow-lg bg-white/90 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-center text-primary">
          <QrCode className="h-12 w-12" />
        </div>
        
        <h2 className="text-2xl font-semibold text-center">FY'S Investment Bot</h2>
        
        <div className="relative aspect-square bg-black/5 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-16 w-16 text-muted-foreground/50" />
          </div>
          <div className="absolute inset-12 border-2 border-dashed border-primary/50 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Circle className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Scan the QR code to connect with WhatsApp
        </p>
      </div>
    </Card>
  );
};

export default QRCodeScanner;
