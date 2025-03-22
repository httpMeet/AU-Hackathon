import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getInvestmentAdvice } from '../api/gemini';

const PortfolioForm = () => {
  const [portfolio, setPortfolio] = useState({
    totalValue: '50000',
    riskScore: '',
    stocks: [{ symbol: '', shares: '' }]
  });

  const [riskProfile, setRiskProfile] = useState({
    tolerance: 'moderate',
    investmentHorizon: '',
    monthlyInvestment: ''
  });

  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://120.120.122.118:8000/api/portfolio/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { risk_score, stocks } = response.data;

        setPortfolio((prev) => ({
          ...prev,
          riskScore: risk_score.toString(),
          stocks: stocks.map(stock => ({
            symbol: stock.company,
            shares: stock.shares.toString()
          }))
        }));
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        toast.error('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleAddStock = () => {
    setPortfolio((prev) => ({
      ...prev,
      stocks: [...prev.stocks, { symbol: '', shares: '' }]
    }));
  };

  const handleRemoveStock = (index) => {
    setPortfolio((prev) => ({
      ...prev,
      stocks: prev.stocks.filter((_, i) => i !== index)
    }));
  };

  const handleStockChange = (index, field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      stocks: prev.stocks.map((stock, i) =>
        i === index ? { ...stock, [field]: value } : stock
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!riskProfile.investmentHorizon || !riskProfile.monthlyInvestment) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('accessToken');

    const requestData = {
      portfolio: {
        total_value: parseFloat(portfolio.totalValue),
        risk_score: parseInt(portfolio.riskScore),
        stocks: portfolio.stocks.map(stock => ({
          company: stock.symbol,
          shares: parseInt(stock.shares)
        }))
      },
      risk_profile: {
        investment_horizon: parseInt(riskProfile.investmentHorizon),
        monthly_investment: parseFloat(riskProfile.monthlyInvestment)
      }
    };

    try {
      await axios.post('http://120.120.122.118:8000/api/portfolio/', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Portfolio data submitted successfully!');

      const aiResponse = await getInvestmentAdvice(portfolio, riskProfile);
      setAiAdvice(aiResponse);

    } catch (error) {
      console.error('Error submitting portfolio:', error);
      toast.error('Failed to submit portfolio data');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-xl shadow-neomorph">
      <form onSubmit={handleSubmit} className="space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading portfolio...</p>
        ) : (
          <div className="space-y-4">

            {/* Static Portfolio Value */}
            <div className="neomorph-input">
              <Label htmlFor="totalValue">Total Portfolio Value ($)</Label>
              <Input
                id="totalValue"
                type="number"
                value={portfolio.totalValue}
                readOnly
                className="w-full"
              />
            </div>

            {/* Risk Score */}
            <div className="neomorph-input">
              <Label htmlFor="riskScore">Risk Score (1-10)</Label>
              <Input
                id="riskScore"
                type="number"
                value={portfolio.riskScore}
                readOnly
                className="w-full"
              />
            </div>

            {/* Stock Holdings */}
            <div className="space-y-2">
              <Label>Stock Holdings</Label>
              {portfolio.stocks.map((stock, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <Input
                    placeholder="Symbol (e.g. AAPL)"
                    value={stock.symbol}
                    onChange={(e) => handleStockChange(index, 'symbol', e.target.value)}
                    className="w-1/2 neomorph-input"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Shares"
                    value={stock.shares}
                    onChange={(e) => handleStockChange(index, 'shares', e.target.value)}
                    className="w-1/2 neomorph-input"
                    required
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveStock(index)}
                      className="bg-red-500 text-white shadow-neomorph"
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
                className="bg-blue-500 text-white hover:bg-blue-600 shadow-neomorph"
              >
                Add Stock
              </Button>
            </div>

            {/* Investment Horizon */}
            <div className="neomorph-input">
              <Label htmlFor="investmentHorizon">Investment Horizon (years)</Label>
              <Input
                id="investmentHorizon"
                type="number"
                min="1"
                value={riskProfile.investmentHorizon}
                onChange={(e) => setRiskProfile((prev) => ({ ...prev, investmentHorizon: e.target.value }))}
                placeholder="e.g. 5"
                required
                className="w-full"
              />
            </div>

            {/* Monthly Investment */}
            <div className="neomorph-input">
              <Label htmlFor="monthlyInvestment">Monthly Investment ($)</Label>
              <Input
                id="monthlyInvestment"
                type="number"
                value={riskProfile.monthlyInvestment}
                onChange={(e) => setRiskProfile((prev) => ({ ...prev, monthlyInvestment: e.target.value }))}
                placeholder="e.g. 500"
                required
                className="w-full"
              />
            </div>

            {/* AI Advice Section */}
            {aiAdvice && (
              <div className="bg-gray-200 p-4 rounded-xl shadow-neomorph mt-6">
                <h3 className="text-xl font-bold text-gray-800">AI Investment Advice</h3>
                <p className="text-gray-600">{aiAdvice.summary}</p>
                <ul className="mt-4 list-disc list-inside">
                  {aiAdvice.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{rec.action}</strong> {rec.symbol} - {rec.details}
                    </li>
                  ))}
                </ul>
                <p className="mt-4"><strong>Risk Assessment:</strong> {aiAdvice.risk_assessment}</p>
                <p><strong>Additional Notes:</strong> {aiAdvice.additional_notes}</p>
              </div>
            )}
          </div>
        )}

        <Button type="submit" onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white shadow-neomorph">
          Submit Portfolio & Get Advice
        </Button>
      </form>
    </div>
  );
};

export default PortfolioForm;