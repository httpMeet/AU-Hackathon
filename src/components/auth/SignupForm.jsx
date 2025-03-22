import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, Phone, Calendar, CreditCard, Home } from 'lucide-react';
import axios from 'axios';

const SignupForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://120.120.122.118:8000";
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [panCard, setPanCard] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePanCard = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !dob || !password || !panCard || !address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validatePanCard(panCard)) {
      toast.error('Please enter a valid PAN card number');
      return;
    }

    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/accounts/signup/`, {
        name,
        email,
        phone,
        dob,
        panCard,
        address,
        password
      });
      
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="name" className="text-left block">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="text-left block">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="phone" className="text-left block">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="dob" className="text-left block">Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="pl-10"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="panCard" className="text-left block">PAN Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="panCard"
              type="text"
              placeholder="ABCDE1234F"
              value={panCard}
              onChange={(e) => setPanCard(e.target.value.toUpperCase())}
              className="pl-10"
              required
              maxLength={10}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Format: ABCDE1234F</p>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="address" className="text-left block">Address</Label>
          <div className="relative">
            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              id="address"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full min-h-[100px] pl-10 py-2 rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="text-left block">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <Label htmlFor="confirmPassword" className="text-left block">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked)}
            required
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the{" "}
            <a href="#" className="text-primary hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm; 