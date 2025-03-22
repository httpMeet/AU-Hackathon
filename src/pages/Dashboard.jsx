import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TransactionHistory from '@/components/TransactionHistory';
import BillManagement from '@/components/BillManagement';
import CreditScore from '@/components/CreditScore';
import AccountOverview from '@/components/AccountOverview';
import AIChatbot from '@/components/AIChatbot';
import TaxAnalysis from '@/components/TaxAnalysis';
import FinancialCharts from '@/components/FinancialCharts';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const accountsDetailRef = useRef(null);

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    accountsDetailRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    const animatableElements = document.querySelectorAll('.animate-appear');
    animatableElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('opacity-0');
      }, index * 100);
    });
  }, [navigate]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'bills', label: 'Bills' },
    { id: 'tax', label: 'Tax Analysis' },
    { id: 'credit', label: 'Credit Score' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Manage your finances and analyze your tax situation</p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4 border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 -mb-px ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="animate-appear opacity-0">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AccountOverview 
                onAccountClick={handleAccountClick} 
                selectedAccount={selectedAccount}
              />
              {!selectedAccount && (
                <div className="text-center mt-8 text-muted-foreground animate-bounce">
                  <p>Click on an account to view details</p>
                  <ChevronDown className="mx-auto mt-2" size={24} />
                </div>
              )}
              <div ref={accountsDetailRef}>
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
              </div>
              <FinancialCharts />
            </div>
          )}

          {activeTab === 'transactions' && <TransactionHistory />}
          {activeTab === 'bills' && <BillManagement />}
          {activeTab === 'tax' && <TaxAnalysis />}
          {activeTab === 'credit' && <CreditScore />}
        </div>

        <div className="fixed bottom-4 right-4">
          <AIChatbot />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
