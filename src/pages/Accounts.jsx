import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AccountOverview from '@/components/AccountOverview';
import { toast } from 'sonner';

const Accounts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Overview</h1>
          <p className="text-muted-foreground mt-2">
            Manage your accounts and track your financial progress
          </p>
        </div>

        <div className="animate-appear">
          <AccountOverview />
        </div>
      </main>
    </div>
  );
};

export default Accounts; 