import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, CreditCard, DollarSign, Wallet, Briefcase, PiggyBank, BarChart4, Receipt, Building, BadgePercent } from 'lucide-react';
import AnimatedCard from './AnimatedCard';
import StatusBadge from './StatusBadge';
import PortfolioForm from './PortfolioForm';
import AdviceDisplay from './AdviceDisplay';
import { Button } from './ui/button';
import { getInvestmentAdvice } from '@/api/gemini';
import { toast } from 'sonner';

// Expanded accounts data with various financial instruments
const accounts = [
  // Banking accounts
  {
    id: 1,
    name: 'Business Account',
    institution: 'HDFC Bank',
    accountNumber: '•••• 4582',
    balance: 2000000,
    type: 'checking',
    category: 'banking',
    status: 'active',
    trend: 'up',
    interestRate: '0.05%',
  },
  {
    id: 2,
    name: 'Savings Account',
    institution: 'First Digital Bank',
    accountNumber: '•••• 7891',
    balance: 12659.32,
    type: 'savings',
    category: 'banking',
    status: 'active',
    trend: 'up',
    interestRate: '1.25%',
  },
  {
    id: 3,
    name: 'Premium Credit Card',
    institution: 'Global Finance',
    accountNumber: '•••• 2468',
    balance: 1453.28,
    type: 'credit',
    category: 'cards',
    status: 'active',
    trend: 'down',
    creditLimit: 10000,
    dueDate: '2023-05-15',
  },
  // Fixed deposits
  // PPS (Public Provident Scheme)
  // Debit cards
  {
    id: 6,
    name: 'Platinum Debit Card',
    institution: 'First Digital Bank',
    accountNumber: '•••• 3579',
    linkedAccount: 'Main Checking',
    type: 'debit',
    category: 'cards',
    status: 'active',
    expiryDate: '05/25',
  },
  // Investments - Stocks
  {
    id: 7,
    name: 'Stock Portfolio',
    institution: 'InvestTrade Securities',
    accountNumber: 'ST-2468',
    balance: 56789.50,
    type: 'stocks',
    category: 'investments',
    status: 'active',
    returns: '+12.4%',
    holdings: 12,
  },
  // KVPs (Kisan Vikas Patra)
  {
    id: 8,
    name: 'Kisan Vikas Patra',
    institution: 'Post Office Savings',
    certificateNumber: 'KVP-1357',
    balance: 50000.00,
    type: 'kvp',
    category: 'investments',
    status: 'active',
    purchaseDate: '2022-09-15',
    doublingPeriod: '124 months',
    interestRate: '6.9%',
  },
  // Additional bank account
  {
    id: 9,
    name: 'Current Account',
    institution: 'Axis Bank',
    accountNumber: '•••• 8642',
    balance: 750000,
    type: 'joint',
    category: 'banking',
    status: 'active',
    trend: 'up',
    interestRate: '0.75%',
  },
  {
    id: 10,
    name: 'Fixed Deposit Account',
    institution: 'SBI Bank',
    accountNumber: '•••• 8642',
    balance: 5000000,
    type: 'FD',
    category: 'banking',
    status: 'active',
    trend: 'up',
    interestRate: '6.8%',
    coOwner: 'Jane Smith',
  },
];

function AccountOverview({ onAccountClick }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [investmentAdvice, setInvestmentAdvice] = useState(null);
  
  const totalBalance = accounts
    .filter(account => account.category !== 'cards' || account.type === 'debit')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalDebt = accounts
    .filter(account => account.type === 'credit')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalInvestments = accounts
    .filter(account => account.category === 'investments' || account.category === 'deposits' || account.category === 'retirement')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const netWorth = totalBalance - totalDebt;

  const filteredAccounts = activeTab === 'all' 
    ? accounts 
    : accounts.filter(account => account.category === activeTab);

  const getAccountIcon = (type, category) => {
    switch(type) {
      case 'checking':
        return <Wallet className="text-blue-500" size={20} />;
      case 'savings':
        return <PiggyBank className="text-green-500" size={20} />;
      case 'credit':
        return <CreditCard className="text-purple-500" size={20} />;
      case 'debit':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'fd':
        return <BadgePercent className="text-amber-500" size={20} />;
      case 'pps':
        return <Building className="text-indigo-500" size={20} />;
      case 'stocks':
        return <BarChart4 className="text-red-500" size={20} />;
      case 'kvp':
        return <Receipt className="text-green-700" size={20} />;
      case 'joint':
        return <DollarSign className="text-teal-500" size={20} />;
      default:
        return <Briefcase className="text-gray-500" size={20} />;
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'banking': return 'Bank Accounts';
      case 'cards': return 'Cards';
      case 'investments': return 'Investments';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const handlePortfolioSubmit = async (data) => {
    try {
      const advice = await getInvestmentAdvice(data.portfolio, data.riskProfile);
      setInvestmentAdvice(advice);
      setShowPortfolioForm(false);
      toast.success('Investment advice generated successfully!');
    } catch (error) {
      console.error('Error getting investment advice:', error);
      toast.error('Failed to generate investment advice. Please try again.');
    }
  };

  const handleAccountClick = (account, e) => {
    e.preventDefault(); // Prevent any default navigation
    setSelectedAccountId(account.id);
    onAccountClick && onAccountClick(account);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard className="p-6 flex flex-col" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold">₹31,290,000</span>
            <span className="ml-2 text-sm text-green-500 flex items-center">
               <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-primary rounded-full"></div>
          </div>
          <span className="mt-2 text-xs text-muted-foreground"></span>
        </AnimatedCard>
        
        <AnimatedCard className="p-6" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Total Investments</span>
          <div className="mt-2">
            <span className="text-3xl font-semibold">₹18,940,000</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 flex items-center">
              +18.2% <ArrowUpRight size={14} className="ml-1" />
            </span>
            <span className="text-xs text-muted-foreground mt-1">Year-to-date return</span>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-6" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Net Worth</span>
          <div className="mt-2">
            <span className="text-3xl font-semibold">₹31,290,000</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-muted-foreground text-xs">Assets</span>
              </div>
              <span className="ml-2 text-green-500 font-semibold">₹40,490,000</span>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                <span className="text-muted-foreground text-xs">Liabilities</span>
              </div>
              <span className="ml-2 text-red-500 font-semibold">₹9,200,000</span>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-xl font-semibold">Your Accounts</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>View All</span>
          <ChevronRight size={16} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'all' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Accounts
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'banking' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('banking')}
            >
              Banking
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'cards' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('cards')}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'investments' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('investments')}
            >
              Investments
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredAccounts.map((account) => (
            <div 
              key={account.id} 
              className="px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer" 
              onClick={(e) => handleAccountClick(account, e)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                    {getAccountIcon(account.type, account.category)}
                  </div>
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-muted-foreground">{account.institution}</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {account.accountNumber || account.certificateNumber}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <div className="font-semibold">
                      {account.type === 'credit' ? '-' : ''}₹{account.balance?.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      {account.interestRate && (
                        <span className="text-xs text-muted-foreground mr-2">
                          {account.interestRate} {account.type === 'fd' || account.type === 'pps' ? 'p.a.' : ''}
                        </span>
                      )}
                      {account.type === 'stocks' && (
                        <span className="text-xs text-green-500">{account.returns}</span>
                      )}
                    </div>
                  </div>
                  
                  {account.type === 'stocks' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccountId(account.id);
                        setShowPortfolioForm(true);
                      }}
                    >
                      Manage Portfolio
                    </Button>
                  )}
                  
                  <StatusBadge 
                    status={account.status === 'active' ? 'success' : 'warning'} 
                    label={account.status === 'active' ? 'Active' : 'Inactive'} 
                  />
                </div>
              </div>
              
              {/* Additional account information */}
              {account.type === 'fd' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Term: {account.term}</span>
                    <span>Matures: {new Date(account.maturityDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {account.type === 'pps' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Yearly Contribution: ₹{account.yearlyContribution?.toLocaleString()}</span>
                    <span>Matures: {new Date(account.maturityDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {account.type === 'stocks' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Holdings: {account.holdings} stocks</span>
                  </div>
                </div>
              )}
              
              {account.type === 'kvp' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Purchased: {new Date(account.purchaseDate).toLocaleDateString()}</span>
                    <span>Doubling Period: {account.doublingPeriod}</span>
                  </div>
                </div>
              )}
              
              {account.type === 'credit' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Credit Limit: ₹{account.creditLimit?.toLocaleString()}</span>
                    <span>Due Date: {new Date(account.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              
              {/* Portfolio Form and Advice Display */}
              {account.type === 'stocks' && selectedAccountId === account.id && (
                <>
                  {showPortfolioForm && (
                    <div className="mt-4 border-t pt-4">
                      <PortfolioForm 
                        onSubmit={handlePortfolioSubmit}
                        onCancel={() => {
                          setShowPortfolioForm(false);
                          setSelectedAccountId(null);
                        }}
                      />
                    </div>
                  )}
                  {investmentAdvice && (
                    <div className="mt-4 border-t pt-4">
                      <AdviceDisplay advice={investmentAdvice} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountOverview; 