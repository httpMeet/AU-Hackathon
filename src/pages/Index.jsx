import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Lock, ShieldCheck, Wallet } from 'lucide-react';
import AccountOverview from '@/components/AccountOverview';
import TransactionHistory from '@/components/TransactionHistory';
import ExpenseChart from '@/components/ExpenseChart';
import BillManagement from '@/components/BillManagement';
import CreditScore from '@/components/CreditScore';
import AIChatbot from '@/components/AIChatbot';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
    
    setIsLoggedIn(loggedInStatus);
    
    // If logged in and completed onboarding, redirect to dashboard
    if (loggedInStatus && hasCompletedOnboarding) {
      navigate('/dashboard');
    }
    // If logged in but not completed onboarding, redirect to onboarding
    else if (loggedInStatus && !hasCompletedOnboarding) {
      navigate('/onboarding');
    }
    // Otherwise show landing page
    else {
      // Add a slight delay to elements for staggered animation effect
      const animatableElements = document.querySelectorAll('.animate-appear');
      animatableElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove('opacity-0');
        }, index * 100);
      });
    }
  }, [navigate]);

  // Landing page content for non-logged in users
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 py-12 md:py-24">
            <div className="md:w-1/2 space-y-6 animate-appear opacity-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Complete Financial Dashboard on the Blockchain
              </h1>
              <p className="text-xl text-muted-foreground">
                Securely manage all your accounts, investments, and financial identity in one place.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="group"
                >
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-10 md:mt-0 animate-appear opacity-0">
              <div className="relative">
                <div className="absolute -top-4 -right-4 -left-4 -bottom-4 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-xl"></div>
                <div className="relative bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                  <img 
                    src="placeholder.svg" 
                    alt="Financial Dashboard Preview" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">Financial Dashboard</h3>
                      <p className="text-white/80">Powered by blockchain technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-muted/30 py-16 mt-12 animate-appear opacity-0">
          <div className="px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Secure Financial Identity System</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our blockchain-based ID system securely consolidates all aspects of your financial identity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure ID Verification</h3>
                <p className="text-muted-foreground">
                  Your PAN card or equivalent financial ID is securely stored and verified on the blockchain.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Management</h3>
                <p className="text-muted-foreground">
                  Track bank accounts, credit, investments, and bills in one unified dashboard.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy Protected</h3>
                <p className="text-muted-foreground">
                  Your financial data remains private and secure with advanced blockchain encryption.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" onClick={() => navigate('/signup')}>
                Learn More
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary mr-2 flex items-center justify-center">
                <span className="text-white font-semibold">B</span>
              </div>
              <span className="text-sm font-medium">BudgetWise</span>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © 2025 BudgetWise. All rights reserved.
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chatbot Component */}
      <AIChatbot />
    </div>
  );
};

export default Index; 