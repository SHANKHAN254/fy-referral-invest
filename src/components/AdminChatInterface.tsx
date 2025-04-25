
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface Message {
  text: string;
  isAdmin: boolean;
  userId?: string;
  timestamp: Date;
}

interface AdminChatInterfaceProps {
  socket: Socket | null;
  selectedUserId: string;
}

const AdminChatInterface: React.FC<AdminChatInterfaceProps> = ({ socket, selectedUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    
    // Clear messages when switching users
    setMessages([]);

    socket.on('message', (message: Message) => {
      if (message.userId === selectedUserId || message.isAdmin) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('userTyping', ({ isTyping, userId }) => {
      if (userId === selectedUserId) {
        setUserTyping(isTyping);
      }
    });

    return () => {
      socket.off('message');
      socket.off('userTyping');
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    if (!isTyping && e.target.value) {
      setIsTyping(true);
      socket.emit('typing', { isTyping: true, isAdmin: true });
    } else if (isTyping && !e.target.value) {
      setIsTyping(false);
      socket.emit('typing', { isTyping: false, isAdmin: true });
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim()) return;

    socket.emit('message', { text: newMessage, userId: selectedUserId });
    setNewMessage('');
    setIsTyping(false);
    socket.emit('typing', { isTyping: false, isAdmin: true });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.isAdmin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {userTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg px-4 py-2 text-sm text-secondary-foreground animate-pulse">
              User is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
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
    </div>
  );
};

export default AdminChatInterface;
