
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface Message {
  text: string;
  isAdmin: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  socket: Socket | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('userTyping', ({ isTyping, isAdmin }) => {
      if (isAdmin) {
        setAdminTyping(isTyping);
      }
    });

    return () => {
      socket.off('message');
      socket.off('userTyping');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    if (!isTyping && e.target.value) {
      setIsTyping(true);
      socket.emit('typing', { isTyping: true, userId: socket.id });
    } else if (isTyping && !e.target.value) {
      setIsTyping(false);
      socket.emit('typing', { isTyping: false, userId: socket.id });
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim()) return;

    socket.emit('message', { text: newMessage });
    setNewMessage('');
    setIsTyping(false);
    socket.emit('typing', { isTyping: false, userId: socket.id });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Support Chat</span>
            {adminTyping && (
              <span className="text-sm text-muted-foreground animate-pulse">
                Agent is typing...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.isAdmin
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
