import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TransactionHistory from '@/components/TransactionHistory';
import BillManagement from '@/components/BillManagement';
import CreditScore from '@/components/CreditScore';
import AccountOverview from '@/components/AccountOverview';
import AIChatbot from '@/components/AIChatbot';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const accountsDetailRef = useRef(null);

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    // Smooth scroll to accounts detail section with offset for navbar
    accountsDetailRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // Add a slight delay to elements for staggered animation effect
    const animatableElements = document.querySelectorAll('.animate-appear');
    animatableElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('opacity-0');
      }, index * 100);
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your accounts, transactions, and financial health
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Account Overview Section */}
          <section className="animate-appear opacity-0">
            <AccountOverview onAccountClick={handleAccountClick} />
            {!selectedAccount && (
              <div className="text-center mt-8 text-muted-foreground animate-bounce">
                <p>Click on an account to view details</p>
                <ChevronDown className="mx-auto mt-2" size={24} />
              </div>
            )}
          </section>
          
          {/* Detailed Account Section */}
          <section 
            ref={accountsDetailRef}
            id="account-details" 
            className={`animate-appear opacity-0 transition-all duration-500 scroll-mt-24 ${
              selectedAccount ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {selectedAccount && (
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedAccount.name} Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-muted-foreground">Institution</h3>
                      <p className="text-lg font-medium">{selectedAccount.institution}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-muted-foreground">Account Number</h3>
                      <p className="text-lg font-medium">{selectedAccount.accountNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-muted-foreground">Current Balance</h3>
                      <p className="text-lg font-medium">
                        ${selectedAccount.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedAccount.interestRate && (
                      <div>
                        <h3 className="text-sm text-muted-foreground">Interest Rate</h3>
                        <p className="text-lg font-medium">{selectedAccount.interestRate}</p>
                      </div>
                    )}
                    {selectedAccount.maturityDate && (
                      <div>
                        <h3 className="text-sm text-muted-foreground">Maturity Date</h3>
                        <p className="text-lg font-medium">{selectedAccount.maturityDate}</p>
                      </div>
                    )}
                    {selectedAccount.returns && (
                      <div>
                        <h3 className="text-sm text-muted-foreground">Returns</h3>
                        <p className="text-lg font-medium">{selectedAccount.returns}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
          
          {/* Bills and Credit Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-appear opacity-0">
            <BillManagement />
            <CreditScore />
          </section>
          
          {/* Transactions Section */}
          <section className="animate-appear opacity-0">
            <TransactionHistory />
          </section>
        </div>
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
              © 2023 BudgetWise. All rights reserved.
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

export default Dashboard; 