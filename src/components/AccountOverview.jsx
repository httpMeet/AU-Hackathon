import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, CreditCard, DollarSign, Wallet, Briefcase, PiggyBank, BarChart4, Receipt, Building, BadgePercent } from 'lucide-react';
import AnimatedCard from './AnimatedCard';
import StatusBadge from './StatusBadge';

// Expanded accounts data with various financial instruments
const accounts = [
  // Banking accounts
  {
    id: 1,
    name: 'Main Checking',
    institution: 'First Digital Bank',
    accountNumber: '•••• 4582',
    balance: 8749.63,
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
  {
    id: 4,
    name: 'Fixed Deposit',
    institution: 'National Savings Bank',
    accountNumber: 'FD-1234',
    balance: 25000.00,
    type: 'fd',
    category: 'deposits',
    status: 'active',
    interestRate: '5.5%',
    maturityDate: '2024-08-10',
    term: '1 year',
  },
  {
    id: 5,
    name: 'Tax Saver FD',
    institution: 'City Financial',
    accountNumber: 'TSFD-5678',
    balance: 150000.00,
    type: 'fd',
    category: 'deposits',
    status: 'active',
    interestRate: '6.8%',
    maturityDate: '2026-03-31',
    term: '5 years',
  },
  // PPS (Public Provident Scheme)
  {
    id: 6,
    name: 'Public Provident Scheme',
    institution: 'Government Savings',
    accountNumber: 'PPS-9876',
    balance: 325000.00,
    type: 'pps',
    category: 'retirement',
    status: 'active',
    interestRate: '7.1%',
    maturityDate: '2035-12-31',
    yearlyContribution: 150000,
  },
  // Debit cards
  {
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
    name: 'Joint Account',
    institution: 'Community Bank',
    accountNumber: '•••• 8642',
    balance: 15750.89,
    type: 'joint',
    category: 'banking',
    status: 'active',
    trend: 'up',
    interestRate: '0.75%',
    coOwner: 'Jane Smith',
  },
];

function AccountOverview() {
  const [activeTab, setActiveTab] = useState('all');
  
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
      case 'deposits': return 'Fixed Deposits';
      case 'investments': return 'Investments';
      case 'retirement': return 'Retirement';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard className="p-6 flex flex-col" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Total Balance</span>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold">${totalBalance.toLocaleString()}</span>
            <span className="ml-2 text-sm text-green-500 flex items-center">
              +2.4% <ArrowUpRight size={14} />
            </span>
          </div>
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-primary rounded-full"></div>
          </div>
          <span className="mt-2 text-xs text-muted-foreground">75% of your monthly goal</span>
        </AnimatedCard>
        
        <AnimatedCard className="p-6" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Total Investments</span>
          <div className="mt-2">
            <span className="text-3xl font-semibold">${totalInvestments.toLocaleString()}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-500 flex items-center">
              +8.2% <ArrowUpRight size={14} className="ml-1" />
            </span>
            <span className="text-xs text-muted-foreground mt-1">Year-to-date return</span>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="p-6" hoverEffect="glow">
          <span className="text-sm text-muted-foreground">Net Worth</span>
          <div className="mt-2">
            <span className="text-3xl font-semibold">${netWorth.toLocaleString()}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-muted-foreground text-xs">Assets</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              <span className="text-muted-foreground text-xs">Liabilities</span>
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
                activeTab === 'deposits' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('deposits')}
            >
              Fixed Deposits
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'investments' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('investments')}
            >
              Investments
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeTab === 'retirement' ? 'bg-primary text-white' : 'hover:bg-muted'
              }`}
              onClick={() => setActiveTab('retirement')}
            >
              Retirement
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
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
                
                <div className="flex flex-col items-end">
                  <div className="font-semibold">
                    {account.type === 'credit' ? '-' : ''}${account.balance?.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-1">
                    {account.interestRate && (
                      <span className="text-xs text-muted-foreground mr-2">
                        {account.interestRate} {account.type === 'fd' || account.type === 'pps' ? 'p.a.' : ''}
                      </span>
                    )}
                    <StatusBadge 
                      status={account.status === 'active' ? 'success' : 'warning'} 
                      label={account.status === 'active' ? 'Active' : 'Inactive'} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional information based on account type */}
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
                    <span>Yearly Contribution: ${account.yearlyContribution?.toLocaleString()}</span>
                    <span>Matures: {new Date(account.maturityDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {account.type === 'stocks' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Returns: <span className="text-green-500">{account.returns}</span></span>
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
                    <span>Credit Limit: ${account.creditLimit?.toLocaleString()}</span>
                    <span>Due Date: {new Date(account.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {account.type === 'joint' && (
                <div className="mt-2 pl-14 text-xs text-muted-foreground">
                  <span>Co-owner: {account.coOwner}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountOverview; 