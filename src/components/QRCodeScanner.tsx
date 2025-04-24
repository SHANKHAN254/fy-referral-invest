
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Camera, Circle, Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const QRCodeScanner = () => {
  const { toast } = useToast();
  const [pairingCode, setPairingCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedPairingCode, setGeneratedPairingCode] = useState("");

  // Simulate QR code generation
  useEffect(() => {
    if (isGeneratingQR) {
      const timer = setTimeout(() => {
        setIsGeneratingQR(false);
      }, 1500); // Quick generation (1.5s)
      
      return () => clearTimeout(timer);
    }
  }, [isGeneratingQR]);

  // Handle phone number submission
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length >= 10) {
      // Generate a random 8-digit pairing code
      const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      setGeneratedPairingCode(randomCode);
      setIsDialogOpen(true);
      
      toast({
        title: "Code Sent",
        description: "Pairing code has been sent to your WhatsApp",
      });
    } else {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
    }
  };

  // Handle manual pairing code submission
  const handlePairingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pairingCode.length === 8) {
      toast({
        title: "Connecting...",
        description: "Please wait while we connect your WhatsApp...",
      });
      
      // Simulate successful connection
      setTimeout(() => {
        toast({
          title: "Connected!",
          description: "Your WhatsApp is now connected to FY'S Investment Bot",
        });
      }, 2000);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 8-digit pairing code",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-md p-6 shadow-lg bg-white/90 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-center text-primary">
            <QrCode className="h-12 w-12" />
          </div>
          
          <h2 className="text-2xl font-semibold text-center">FY'S Investment Bot</h2>
          
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="phone">Phone Number</TabsTrigger>
            </TabsList>
            
            <TabsContent value="qr" className="space-y-4">
              <div className="relative aspect-square bg-black/5 rounded-lg overflow-hidden">
                {isGeneratingQR ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <Circle className="h-10 w-10 text-primary animate-pulse" />
                    <p className="text-sm animate-pulse">Generating QR code...</p>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <div className="absolute inset-12 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-white p-2 rounded shadow-md grid grid-cols-3 grid-rows-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className={`bg-black ${i === 4 ? "bg-white" : ""}`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Circle className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <p className="text-center text-sm text-muted-foreground">
                  Scan this QR code with your WhatsApp to connect
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsGeneratingQR(true)}
                  className="text-xs"
                >
                  Refresh QR Code
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4">
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Phone className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      type="tel"
                      placeholder="Enter your WhatsApp number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-lg"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      Example: 0712345678 or 2547123456789
                    </p>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={phoneNumber.length < 10}>
                  Send Pairing Code
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  We'll send a pairing code to your WhatsApp
                </p>
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Manual pairing code input option */}
          <div className="pt-4 border-t border-border">
            <p className="text-center text-sm font-medium mb-3">Already have a pairing code?</p>
            <form onSubmit={handlePairingSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter 8-digit code"
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  maxLength={8}
                />
                <Button type="submit" disabled={pairingCode.length !== 8}>
                  Connect
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
      
      {/* Dialog for displaying the generated pairing code */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>WhatsApp Pairing Code</DialogTitle>
            <DialogDescription>
              Enter this code in your WhatsApp to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <MessageCircle className="h-12 w-12 text-green-500" />
            
            <div className="bg-gray-100 p-4 rounded-lg w-full">
              <p className="text-center font-mono text-2xl tracking-widest">
                {generatedPairingCode.split('').join(' ')}
              </p>
            </div>
            
            <p className="text-sm text-center text-muted-foreground">
              A message with this code has been sent to your WhatsApp. 
              Please enter it within 60 seconds.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeScanner;
