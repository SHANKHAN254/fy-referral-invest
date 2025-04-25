
import React, { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ChatRegistration from '@/components/ChatRegistration';
import ChatInterface from '@/components/ChatInterface';

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleRegistration = (userData: any) => {
    if (socket) {
      socket.emit('register', userData);
      socket.once('registered', () => {
        setIsRegistered(true);
        toast({
          title: "Successfully connected",
          description: "You are now connected to customer support"
        });
      });
    }
  };

  if (!isRegistered) {
    return <ChatRegistration onRegister={handleRegistration} />;
  }

  return <ChatInterface socket={socket} />;
};

export default Chat;
