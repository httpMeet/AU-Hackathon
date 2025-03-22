import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PortfolioForm = ({ onSubmit }) => {
  const [portfolio, setPortfolio] = useState({
    totalValue: '',
    riskScore: '',
    stocks: [{ symbol: '', shares: '' }]
  });

  const [riskProfile, setRiskProfile] = useState({
    tolerance: 'moderate',
    investmentHorizon: '',
    monthlyInvestment: ''
  });

  const handleAddStock = () => {
    setPortfolio(prev => ({
      ...prev,
      stocks: [...prev.stocks, { symbol: '', shares: '' }]
    }));
  };

  const handleRemoveStock = (index) => {
    setPortfolio(prev => ({
      ...prev,
      stocks: prev.stocks.filter((_, i) => i !== index)
    }));
  };

  const handleStockChange = (index, field, value) => {
    setPortfolio(prev => ({
      ...prev,
      stocks: prev.stocks.map((stock, i) => 
        i === index ? { ...stock, [field]: value } : stock
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!portfolio.totalValue || !portfolio.riskScore || !riskProfile.investmentHorizon || !riskProfile.monthlyInvestment) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert string values to numbers
    const formattedData = {
      portfolio: {
        ...portfolio,
        totalValue: parseFloat(portfolio.totalValue),
        riskScore: parseInt(portfolio.riskScore),
        stocks: portfolio.stocks.map(stock => ({
          ...stock,
          shares: parseInt(stock.shares)
        }))
      },
      riskProfile: {
        ...riskProfile,
        investmentHorizon: parseInt(riskProfile.investmentHorizon),
        monthlyInvestment: parseFloat(riskProfile.monthlyInvestment)
      }
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="totalValue">Total Portfolio Value ($)</Label>
          <Input
            id="totalValue"
            type="number"
            value={portfolio.totalValue}
            onChange={(e) => setPortfolio(prev => ({ ...prev, totalValue: e.target.value }))}
            placeholder="e.g. 10000"
            required
          />
        </div>

        <div>
          <Label htmlFor="riskScore">Risk Score (1-10)</Label>
          <Input
            id="riskScore"
            type="number"
            min="1"
            max="10"
            value={portfolio.riskScore}
            onChange={(e) => setPortfolio(prev => ({ ...prev, riskScore: e.target.value }))}
            placeholder="e.g. 7"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Stock Holdings</Label>
          {portfolio.stocks.map((stock, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Symbol (e.g. AAPL)"
                value={stock.symbol}
                onChange={(e) => handleStockChange(index, 'symbol', e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Shares"
                value={stock.shares}
                onChange={(e) => handleStockChange(index, 'shares', e.target.value)}
                required
              />
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => handleRemoveStock(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddStock}
          >
            Add Stock
          </Button>
        </div>

        <div>
          <Label htmlFor="tolerance">Risk Tolerance</Label>
          <select
            id="tolerance"
            className="w-full p-2 border rounded"
            value={riskProfile.tolerance}
            onChange={(e) => setRiskProfile(prev => ({ ...prev, tolerance: e.target.value }))}
            required
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div>
          <Label htmlFor="investmentHorizon">Investment Horizon (years)</Label>
          <Input
            id="investmentHorizon"
            type="number"
            min="1"
            value={riskProfile.investmentHorizon}
            onChange={(e) => setRiskProfile(prev => ({ ...prev, investmentHorizon: e.target.value }))}
            placeholder="e.g. 5"
            required
          />
        </div>

        <div>
          <Label htmlFor="monthlyInvestment">Monthly Investment ($)</Label>
          <Input
            id="monthlyInvestment"
            type="number"
            value={riskProfile.monthlyInvestment}
            onChange={(e) => setRiskProfile(prev => ({ ...prev, monthlyInvestment: e.target.value }))}
            placeholder="e.g. 500"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Get Investment Advice
      </Button>
    </form>
  );
};

export default PortfolioForm; 