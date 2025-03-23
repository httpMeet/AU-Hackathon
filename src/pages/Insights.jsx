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
import { analyzeStock } from '@/api/gemini1';
import TaxAnalysis from '@/components/TaxAnalysis';
import FinancialCharts from '@/components/FinancialCharts';

const stocksList = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.34,
    change: '+2.5%',
    sharesOwned: 100
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 415.50,
    change: '+0.8%',
    sharesOwned: 50
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 147.60,
    change: '-1.2%',
    sharesOwned: 75
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    currentPrice: 178.25,
    change: '+3.1%',
    sharesOwned: 60
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 890.15,
    change: '+0.5%',
    sharesOwned: 40
  }
];

const Insights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stockPredictions, setStockPredictions] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSection, setActiveSection] = useState('stocks');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      toast.error('Please log in to view insights');
      navigate('/login');
      return;
    }
    loadPredictions();
  }, [navigate]);

  const loadPredictions = async () => {
    setLoading(true);
    const predictions = {};
    let hasError = false;
    
    try {
      // Load predictions one at a time
      for (const stock of stocksList) {
        try {
          const analysis = await analyzeStock(stock.symbol, stock.sharesOwned);
          predictions[stock.symbol] = analysis.recommendation;
          // Update predictions as they come in
          setStockPredictions(prev => ({ ...prev, [stock.symbol]: analysis.recommendation }));
        } catch (error) {
          console.error(`Error loading prediction for ${stock.symbol}:`, error);
          hasError = true;
          // Set a placeholder for failed predictions
          predictions[stock.symbol] = 'ANALYZING...';
        }
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      toast.error(error.message || 'Failed to load some predictions');
      hasError = true;
    } finally {
      setLoading(false);
      if (hasError) {
        toast.error('Some predictions failed to load. Click the stock to try again.');
      }
    }
  };

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
    setAnalyzing(true);

    try {
      const analysis = await analyzeStock(stock.symbol, stock.sharesOwned);
      setAnalysisResult(analysis);
      // Update the prediction in the list
      setStockPredictions(prev => ({ ...prev, [stock.symbol]: analysis.recommendation }));
    } catch (error) {
      console.error('Error analyzing stock:', error);
      toast.error(error.message || 'Failed to analyze stock');
      setAnalysisResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto pt-24 pb-16 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading stock predictions...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Financial Insights</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive financial analysis and insights
          </p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveSection('stocks')}
              className={`py-2 px-4 -mb-px ${
                activeSection === 'stocks'
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Stock Predictions
            </button>
            <button
              onClick={() => setActiveSection('financial')}
              className={`py-2 px-4 -mb-px ${
                activeSection === 'financial'
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Financial Overview
            </button>
            <button
              onClick={() => setActiveSection('tax')}
              className={`py-2 px-4 -mb-px ${
                activeSection === 'tax'
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Analysis
            </button>
          </nav>
        </div>

        {activeSection === 'stocks' && (
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
                    <div className="mt-2">
                      <p className="text-xl font-semibold text-gray-900">
                        ${stock.currentPrice}
                      </p>
                      <p className="text-sm text-gray-600">
                        {stock.sharesOwned} shares owned
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStockClick(stock)}
                    className={`${getPredictionStyle(stockPredictions[stock.symbol])} font-bold text-lg px-8 py-6`}
                    disabled={analyzing}
                  >
                    {stockPredictions[stock.symbol] || 'ANALYZING...'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'financial' && (
          <div className="space-y-8">
            <FinancialCharts />
          </div>
        )}

        {activeSection === 'tax' && (
          <div className="space-y-8">
            <TaxAnalysis />
          </div>
        )}

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
                {analysisResult && (
                  <Badge className={getPredictionStyle(analysisResult.recommendation)}>
                    {analysisResult.recommendation}
                  </Badge>
                )}
              </div>
              <DialogDescription className="mt-4">
                {analyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-lg text-gray-600">Generating AI analysis...</div>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Technical Analysis</h3>
                      <p>Trend: {analysisResult.analysis.technical.trend}</p>
                      <p>Strength: {(analysisResult.analysis.technical.strength * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Market Sentiment</h3>
                      <p>Overall: {analysisResult.analysis.sentiment.overall}</p>
                      <p>Score: {analysisResult.analysis.sentiment.score.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Risk Assessment</h3>
                      <p>Level: {analysisResult.analysis.risk.level}</p>
                      <p>Factors: {analysisResult.analysis.risk.factors.join(', ')}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Portfolio Impact</h3>
                      <p>Current Value: ${analysisResult.portfolio_impact.current_value.toFixed(2)}</p>
                      <p>Potential Change: ${analysisResult.portfolio_impact.potential_change.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Recent News</h3>
                      {analysisResult.news.map((item, index) => (
                        <div key={index} className="mb-3">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.summary}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{item.sentiment}</Badge>
                            <Badge variant="outline">Impact: {item.impact}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Reasoning</h3>
                      <p>{analysisResult.reasoning}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    Failed to load analysis. Please try again.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Insights; 