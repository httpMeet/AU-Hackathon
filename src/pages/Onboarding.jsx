import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingForm from '@/components/auth/OnboardingForm';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    if (hasCompletedOnboarding === 'true') {
      toast.info('You have already completed onboarding');
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="space-y-2 text-center mb-8">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary overflow-hidden mb-2">
              <span className="text-white font-semibold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold">Almost there!</h1>
            <p className="text-muted-foreground">Complete your profile to access the dashboard</p>
          </div>
          
          <OnboardingForm />
        </div>
      </div>
      
      <footer className="py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex justify-center items-center">
            <div className="text-sm text-muted-foreground">
              © 2023 BudgetWise. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding; 