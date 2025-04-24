
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Camera, Circle, Phone, MessageCircle, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { io, Socket } from "socket.io-client";

const QRCodeScanner = () => {
  const { toast } = useToast();
  const [pairingCode, setPairingCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedPairingCode, setGeneratedPairingCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; phone: string } | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting to server...");

  // Initialize WebSocket connection
  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on("connect", () => {
      setConnectionStatus("Connected to server");
      console.log("Connected to WebSocket server");
    });

    newSocket.on("disconnect", () => {
      setConnectionStatus("Disconnected from server");
      console.log("Disconnected from WebSocket server");
    });

    newSocket.on("qr", (data) => {
      setQrCodeUrl(data.url);
      setIsLoading(false);
      toast({
        title: "QR Code Generated",
        description: "Scan this QR code with your WhatsApp to connect",
      });
    });

    newSocket.on("pairingCode", (data) => {
      setGeneratedPairingCode(data.code);
      setIsDialogOpen(true);
      setIsLoading(false);
      toast({
        title: "Code Generated",
        description: "Enter this code in your WhatsApp to connect",
      });
    });

    newSocket.on("ready", (data) => {
      setIsAuthenticated(true);
      setUserInfo(data);
      setIsLoading(false);
      setIsDialogOpen(false);
      toast({
        title: "Connected!",
        description: `WhatsApp connected for ${data.name}`,
      });
    });

    newSocket.on("authenticated", () => {
      toast({
        title: "Authenticated",
        description: "WhatsApp authentication successful",
      });
    });

    newSocket.on("auth_failure", (data) => {
      setIsLoading(false);
      toast({
        title: "Authentication Failed",
        description: data.message,
        variant: "destructive",
      });
    });

    newSocket.on("error", (data) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [toast]);

  // Request new QR code
  const handleRefreshQR = () => {
    setIsLoading(true);
    setQrCodeUrl("");
    
    // The server will automatically emit a new QR code when this happens
    if (socket) {
      socket.emit("requestQr");
    }
  };

  // Handle phone number submission for pairing code
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      
      if (socket) {
        socket.emit("requestPairingCode", { phoneNumber });
      } else {
        setIsLoading(false);
        toast({
          title: "Connection Error",
          description: "Not connected to server",
          variant: "destructive",
        });
      }
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
        title: "Manual Pairing",
        description: "Enter this code in your WhatsApp application",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 8-digit pairing code",
        variant: "destructive",
      });
    }
  };

  // If already authenticated, show user info
  if (isAuthenticated && userInfo) {
    return (
      <Card className="w-full max-w-md p-6 shadow-lg bg-white/90 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-center text-green-500">
            <MessageCircle className="h-12 w-12" />
          </div>
          
          <h2 className="text-2xl font-semibold text-center">WhatsApp Connected</h2>
          
          <div className="space-y-2 text-center">
            <p className="font-medium">{userInfo.name}</p>
            <p className="text-muted-foreground">{userInfo.phone}</p>
          </div>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => {
              if (socket) socket.emit("logout");
              setIsAuthenticated(false);
              setUserInfo(null);
            }}
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md p-6 shadow-lg bg-white/90 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-center text-primary">
            <QrCode className="h-12 w-12" />
          </div>
          
          <h2 className="text-2xl font-semibold text-center">FY'S Investment Bot</h2>
          <p className="text-center text-sm text-muted-foreground">{connectionStatus}</p>
          
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="phone">Phone Number</TabsTrigger>
            </TabsList>
            
            <TabsContent value="qr" className="space-y-4">
              <div className="relative aspect-square bg-black/5 rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <Loader className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm">Generating QR code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={qrCodeUrl} 
                      alt="WhatsApp QR Code" 
                      className="max-w-full max-h-full p-4"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <Camera className="h-16 w-16 text-muted-foreground/50" />
                    <Button 
                      variant="default" 
                      onClick={handleRefreshQR}
                    >
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </div>
              
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Scan this QR code with your WhatsApp to connect
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshQR}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Generating...' : 'Refresh QR Code'}
                  </Button>
                </div>
              )}
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
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={phoneNumber.length < 10 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Pairing Code'
                  )}
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
                <Button type="submit" disabled={pairingCode.length !== 8 || isLoading}>
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
              Open WhatsApp on your phone, go to Settings &gt; Linked Devices &gt; Link a Device, 
              then enter this code within 60 seconds.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeScanner;
