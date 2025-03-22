import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { HelpCircle, IdCard, Info, Map } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';

const OnboardingForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const [panCard, setPanCard] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  // Fetch user ID and token from localStorage
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('user_id');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    if (!validatePanCard(panCard)) {
      toast.error('Invalid PAN card format');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/accounts/userprofile/`,
        {
          user: userId,
          address,
          ufi: panCard
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Profile setup completed');
      localStorage.setItem('hasCompletedOnboarding', 'true');
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(error.response?.data?.error || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePanCard = (value) => {
    // Indian PAN: 5 letters + 4 digits + 1 letter
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          We need a few more details to set up your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="panCard">PAN Card Number</Label>
              <button 
                type="button" 
                className="inline-flex items-center text-xs text-muted-foreground hover:text-primary"
                onClick={() => toast.info('Your PAN card information is encrypted and secured using blockchain technology.')}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Why is this needed?
              </button>
            </div>
            
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="panCard"
                type="text"
                placeholder="ABCDE1234F"
                value={panCard}
                onChange={(e) => setPanCard(e.target.value.toUpperCase())}
                className="pl-10"
                required
              />
            </div>
            {panCard && !validatePanCard(panCard) && (
              <p className="text-xs text-destructive flex items-center mt-1">
                <Info className="h-3 w-3 mr-1" />
                PAN should be 5 letters + 4 digits + 1 letter
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="address"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
          </div>
          
          <div className="flex items-start space-x-2 mt-6">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </label>
              <p className="text-xs text-muted-foreground">
                Your data is securely stored using blockchain technology.
              </p>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Completing setup..." : "Complete Setup"}
        </Button>
      </form>
    </div>
  );
};

export default OnboardingForm;
