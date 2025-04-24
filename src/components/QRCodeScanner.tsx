
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Camera, Circle, Key } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QRCodeScanner = () => {
  const { toast } = useToast();
  const [pairingCode, setPairingCode] = useState("");

  const handlePairingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pairingCode.length === 8) {
      toast({
        title: "Pairing Code Submitted",
        description: "Please wait while we connect your WhatsApp...",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 8-digit pairing code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg bg-white/90 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-center text-primary">
          <QrCode className="h-12 w-12" />
        </div>
        
        <h2 className="text-2xl font-semibold text-center">FY'S Investment Bot</h2>
        
        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="code">Pairing Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <form onSubmit={handlePairingSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Key className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter 8-digit pairing code"
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value.slice(0, 8))}
                  className="text-center text-lg tracking-wider"
                  maxLength={8}
                />
              </div>
              <Button type="submit" className="w-full" disabled={pairingCode.length !== 8}>
                Connect
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Enter the pairing code displayed in WhatsApp
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default QRCodeScanner;
