import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'sonner';

const SmartContracts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Mock transactions data
  const transactions = [
    {
      id: 1,
      type: 'Transfer',
      amount: '0.5 ETH',
      status: 'completed',
      from: '0x1234...5678',
      to: '0x8765...4321',
      timestamp: '2024-03-21T10:30:00',
      hash: '0xabcd...efgh',
      gas: '0.002 ETH'
    },
    {
      id: 2,
      type: 'Smart Contract',
      amount: '100 USDT',
      status: 'pending',
      from: '0x1234...5678',
      to: 'DeFi Protocol',
      timestamp: '2024-03-21T09:15:00',
      hash: '0xijkl...mnop',
      gas: '0.003 ETH'
    },
    {
      id: 3,
      type: 'NFT Purchase',
      amount: '2.5 ETH',
      status: 'completed',
      from: '0x1234...5678',
      to: 'NFT Marketplace',
      timestamp: '2024-03-21T08:45:00',
      hash: '0xpqrs...tuvw',
      gas: '0.004 ETH'
    },
    {
      id: 4,
      type: 'Token Swap',
      amount: '1000 USDC',
      status: 'failed',
      from: '0x1234...5678',
      to: 'DEX Protocol',
      timestamp: '2024-03-21T07:30:00',
      hash: '0xwxyz...abcd',
      gas: '0.001 ETH'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Filter and search transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      tx.type.toLowerCase().includes(searchLower) ||
      tx.from.toLowerCase().includes(searchLower) ||
      tx.to.toLowerCase().includes(searchLower) ||
      tx.hash.toLowerCase().includes(searchLower) ||
      tx.amount.toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Smart Contracts & Transactions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your blockchain transactions and smart contract interactions
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{tx.type}</h3>
                      {getStatusBadge(tx.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {tx.from}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To: {tx.to}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{tx.amount}</Badge>
                      <Badge variant="outline">Gas: {tx.gas}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {tx.hash}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SmartContracts;