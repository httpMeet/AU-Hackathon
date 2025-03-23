import React, { useState } from 'react';
import { BarChart3, AlertCircle, PiggyBank, TrendingUp, Calculator, Receipt, FileText, CheckCircle2 } from 'lucide-react';
import { analyzeTaxData } from '@/api/gemini2';

const initialFinancialData = {
  salary: 0,
  business_income: 12000000,
  stocks: { profits: 320000, losses: 0 },
  expenses: { rent: 1200000, medical: 350000, insurance: 400000 },
  investments: { mutual_funds: 900000, pension_fund: 1950000 }
};
const financialData = {
  salary: 0, // No salary data provided
  business_income: 12000000, // Extracted from business_income
  stocks: {
    profits: 320000, // Profit from Tata Motors stock sell
    losses: 0 // No explicit losses mentioned
  },
  expenses: {
    rent: 1200000, // Extracted from expenses
    medical: 350000, // Employee health insurance premium
    insurance: 400000 // Business insurance premium
  },
  investments: {
    mutual_funds: 900000, // Sum of mutual fund investments
    pension_fund: 1950000 // EPF + NPS balances
  }
};
const TaxAnalysis = () => {
  const [financialData, setFinancialData] = useState(initialFinancialData);
  const [taxAnalysis, setTaxAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (category, subcategory, value) => {
    const numValue = parseFloat(value) || 0;
    
    if (subcategory) {
      setFinancialData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subcategory]: numValue
        }
      }));
    } else {
      setFinancialData(prev => ({
        ...prev,
        [category]: numValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await analyzeTaxData(financialData);
      setTaxAnalysis(results);
    } catch (err) {
      setError('Failed to analyze tax data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const SummaryCard = ({ title, amount, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold">{formatCurrency(amount)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Tax Analysis</h2>
        <p className="text-gray-600">
          Calculate your tax and perform analysis as per your current portfolio.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Tax Data'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {taxAnalysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Income"
              amount={taxAnalysis.income_sources.total}
              icon={BarChart3}
            />
            <SummaryCard
              title="Net Taxable Income"
              amount={taxAnalysis.taxable_income.net_taxable}
              icon={Calculator}
            />
            <SummaryCard
              title="Total Tax Liability"
              amount={taxAnalysis.tax_liability.total_tax}
              icon={Receipt}
            />
            <SummaryCard
              title="Total Deductions"
              amount={Object.values(taxAnalysis.deductions).reduce(
                (acc, curr) => acc + curr.amount,
                0
              )}
              icon={FileText}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Optimization Strategies</h3>
            <div className="space-y-4">
              {taxAnalysis.optimization_strategies.map((strategy, index) => (
                <div key={index} className="border-b pb-4">
                  <h4 className="font-medium text-lg mb-2">{strategy.category}</h4>
                  <ul className="space-y-2">
                    {strategy.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p>{suggestion.action}</p>
                          <p className="text-sm text-gray-500">
                            Potential Savings: {formatCurrency(suggestion.potential_savings)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxAnalysis; 