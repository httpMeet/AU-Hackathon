import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { getStockAnalysis } from '@/utils/gemini';

const stocksList = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.34,
    prediction: 'BUY',
    change: '+2.5%',
    reason: 'Strong product pipeline, services growth, and market position'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 415.50,
    prediction: 'HOLD',
    change: '+0.8%',
    reason: 'Fair valuation at current levels, steady growth'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 147.60,
    prediction: 'SELL',
    change: '-1.2%',
    reason: 'Increasing competition in AI space, regulatory concerns'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    currentPrice: 178.25,
    prediction: 'BUY',
    change: '+3.1%',
    reason: 'E-commerce dominance, AWS growth, advertising potential'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 890.15,
    prediction: 'HOLD',
    change: '+0.5%',
    reason: 'Strong AI position but high valuation'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    currentPrice: 505.28,
    prediction: 'BUY',
    change: '+1.8%',
    reason: 'Metaverse potential, strong ad revenue, AI integration'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 175.34,
    prediction: 'SELL',
    change: '-2.7%',
    reason: 'Increasing EV competition, margin pressure'
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    currentPrice: 182.90,
    prediction: 'BUY',
    change: '+1.2%',
    reason: 'Strong financial position, rising interest rates benefit'
  }
];

const Insights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      toast.error('Please log in to view insights');
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const getPredictionStyle = (prediction) => {
    switch (prediction) {
      case 'BUY':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'SELL':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'HOLD':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getChangeColor = (change) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const handleStockClick = async (stock) => {
    setSelectedStock(stock);
    setShowDialog(true);
    try {
      const analysis = await getStockAnalysis(stock.symbol, stock.prediction);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysisResult(stock.reason);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto pt-24 pb-16 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading insights...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Predictions</h1>
          <p className="text-gray-600 mt-2">
            AI-powered stock recommendations with buy, sell, or hold predictions
          </p>
        </div>

        <div className="grid gap-4">
          {stocksList.map((stock) => (
            <Card 
              key={stock.symbol} 
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">{stock.symbol}</h3>
                    <span className={`${getChangeColor(stock.change)} font-semibold`}>
                      {stock.change}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 mt-1">{stock.name}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">
                    ${stock.currentPrice}
                  </p>
                </div>
                <Button
                  onClick={() => handleStockClick(stock)}
                  className={`${getPredictionStyle(stock.prediction)} font-bold text-lg px-8 py-6`}
                >
                  {stock.prediction}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedStock?.name} ({selectedStock?.symbol}) Analysis
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-semibold">${selectedStock?.currentPrice}</span>
                <span className={`font-medium ${selectedStock?.change && getChangeColor(selectedStock.change)}`}>
                  {selectedStock?.change}
                </span>
                <Badge className={getPredictionStyle(selectedStock?.prediction)}>
                  {selectedStock?.prediction}
                </Badge>
              </div>
              <DialogDescription className="mt-4">
                <div className="mt-4 space-y-4 text-base">
                  {analysisResult.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Insights; 