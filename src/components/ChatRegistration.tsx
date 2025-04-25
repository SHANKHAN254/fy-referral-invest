
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from 'lucide-react';

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
}

interface ChatRegistrationProps {
  onRegister: (data: RegistrationForm) => void;
}

const ChatRegistration: React.FC<ChatRegistrationProps> = ({ onRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">Welcome to Live Support</CardTitle>
          <p className="text-muted-foreground">Please enter your details to start chatting</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  className="pl-10"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <span className="text-sm text-destructive">Name is required</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <span className="text-sm text-destructive">Valid email is required</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  {...register("phone", { required: true })}
                  className="pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <span className="text-sm text-destructive">Phone number is required</span>}
            </div>

            <Button type="submit" className="w-full">
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatRegistration;
