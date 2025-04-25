
import React, { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AdminChatInterface from '@/components/AdminChatInterface';

const Admin: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.on('updateUserList', (userList) => {
      setUsers(userList.filter((user: any) => !user.isAdmin));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple password for demo purposes
      if (socket) {
        socket.emit('adminLogin');
        setIsLoggedIn(true);
        toast({
          title: "Admin Login Successful",
          description: "You are now logged in as admin"
        });
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const selectUser = (userId: string) => {
    setSelectedUser(userId);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="container mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Customer Support Admin Panel</CardTitle>
            <CardDescription>Manage customer conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="md:col-span-1 border-r p-4">
                <h3 className="font-medium mb-4">Active Users</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-sm">No active users</p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id || user.email}
                        onClick={() => selectUser(user.id || user.email)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedUser === (user.id || user.email)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-xs opacity-80">{user.email}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                {selectedUser ? (
                  <AdminChatInterface socket={socket} selectedUserId={selectedUser} />
                ) : (
                  <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                    Select a user to start chatting
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
