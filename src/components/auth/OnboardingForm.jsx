import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  CreditCard, 
  HelpCircle, 
  IdCard, 
  Info, 
  Map, 
  Phone
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const OnboardingForm = () => {
  const [taxId, setTaxId] = useState('');
  const [taxIdType, setTaxIdType] = useState('pan');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is a mock onboarding - in a real app, you would connect to a backend
      if (taxId && phone && address) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store the onboarding data in localStorage for demo purposes
        localStorage.setItem('hasCompletedOnboarding', 'true');
        localStorage.setItem('user_taxId', taxId);
        localStorage.setItem('user_taxIdType', taxIdType);
        localStorage.setItem('user_phone', phone);
        localStorage.setItem('user_address', address);
        
        toast.success('Profile setup completed');
        navigate('/dashboard');
      } else {
        toast.error('Please fill in all required fields');
      }
    } catch (error) {
      toast.error('Profile setup failed. Please try again.');
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const taxIdPlaceholder = taxIdType === 'pan' 
    ? 'ABCDE1234F' 
    : taxIdType === 'ssn' 
    ? '123-45-6789' 
    : 'Tax/Financial ID';

  const validateTaxId = (value) => {
    if (taxIdType === 'pan') {
      // Indian PAN: 5 letters + 4 digits + 1 letter
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    } else if (taxIdType === 'ssn') {
      // US SSN: XXX-XX-XXXX format
      return /^\d{3}-\d{2}-\d{4}$/.test(value);
    }
    // For other types, just ensure it's not empty
    return value.length > 0;
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
          <div>
            <Label htmlFor="taxIdType">ID Type</Label>
            <Select 
              value={taxIdType} 
              onValueChange={setTaxIdType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pan">PAN Card (India)</SelectItem>
                <SelectItem value="ssn">Social Security Number (US)</SelectItem>
                <SelectItem value="tax_id">National Tax ID</SelectItem>
                <SelectItem value="fin_id">Financial ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="taxId">
                {taxIdType === 'pan' 
                  ? 'PAN Card Number' 
                  : taxIdType === 'ssn' 
                  ? 'Social Security Number' 
                  : taxIdType === 'tax_id'
                  ? 'National Tax ID'
                  : 'Financial ID'}
              </Label>
              <button 
                type="button" 
                className="inline-flex items-center text-xs text-muted-foreground hover:text-primary"
                onClick={() => toast.info('Your ID information is encrypted and secured using blockchain technology.')}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Why is this needed?
              </button>
            </div>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="taxId"
                type="text"
                placeholder={taxIdPlaceholder}
                value={taxId}
                onChange={(e) => {
                  const value = e.target.value;
                  // If it's a PAN card, convert to uppercase
                  setTaxId(taxIdType === 'pan' ? value.toUpperCase() : value);
                }}
                className="pl-10"
                required
              />
            </div>
            {taxId && !validateTaxId(taxId) && (
              <p className="text-xs text-destructive flex items-center mt-1">
                <Info className="h-3 w-3 mr-1" />
                {taxIdType === 'pan' 
                  ? 'PAN should be 5 letters + 4 digits + 1 letter' 
                  : taxIdType === 'ssn' 
                  ? 'SSN should be in XXX-XX-XXXX format'
                  : 'Please enter a valid ID'}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
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