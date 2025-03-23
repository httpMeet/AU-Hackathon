import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Send,
  Bot,
  User,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { analyzeSmartContract } from '../api/gemini3';

/**
 * @typedef {Object} Message
 * @property {'user' | 'bot'} type - The type of message
 * @property {string} content - The message content
 * @property {Date} timestamp - The message timestamp
 */

// SmartContractChatbot Component
const SmartContractChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add initial welcome message
    setMessages([{
      type: 'bot',
      content: 'Hello! I\'m your Smart Contract Assistant. How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeSmartContract(userMessage.content);
      const botMessage = {
        type: 'bot',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200"
      role="region"
      aria-label="Smart Contract Assistant Chat Interface"
    >
      <div 
        className="bg-blue-600 p-4 rounded-t-lg"
        role="banner"
      >
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-6 h-6" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Smart Contract Assistant</h2>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
            role="article"
            aria-label={`${message.type === 'user' ? 'Your message' : 'Assistant response'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-blue-600'
              }`}
              aria-hidden="true"
            >
              {message.type === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={`flex-1 rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </span>
                <span className={`text-sm ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div 
            className="flex items-center gap-3"
            role="status"
            aria-label="Loading response"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 rounded-lg p-4 bg-white border border-gray-200">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="p-4 border-t border-gray-200 bg-white"
        role="form"
        aria-label="Chat message form"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about smart contracts..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
            aria-label="Message input"
            role="textbox"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

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

        <div className="grid gap-4 mb-8">
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

        {/* Smart Contract Chatbot Section */}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Smart Contract Assistant</h2>
            <p className="text-muted-foreground mt-1">
              Get expert guidance on smart contracts, blockchain development, and DeFi protocols
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SmartContractChatbot />
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Ask about smart contract security best practices</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Learn about gas optimization techniques</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Get help with contract deployment steps</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Understand common vulnerabilities and fixes</p>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]:not([placeholder="Search transactions..."])');
                      if (input) {
                        input.value = 'How to implement ERC20 tokens?';
                        input.focus();
                      }
                    }}
                  >
                    ERC20 Tokens
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]:not([placeholder="Search transactions..."])');
                      if (input) {
                        input.value = 'Explain NFT standards and implementation';
                        input.focus();
                      }
                    }}
                  >
                    NFT Standards
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]:not([placeholder="Search transactions..."])');
                      if (input) {
                        input.value = 'How to build secure DeFi protocols?';
                        input.focus();
                      }
                    }}
                  >
                    DeFi Protocols
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartContracts;