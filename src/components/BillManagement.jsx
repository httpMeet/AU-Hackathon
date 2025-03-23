import React from 'react';
import { TrendingUp, Banknote, Home, Gem, Plus } from 'lucide-react';
import AnimatedCard from './AnimatedCard';
import StatusBadge from './StatusBadge';

const investments = {
  stocks: [
    { company: 'Reliance Industries', company_code: 'RELIANCE', stocks_owned: 500, purchase_price: 2400 },
    { company: 'HDFC Bank', company_code: 'HDFCBANK', stocks_owned: 300, purchase_price: 1600 },
    { company: 'Tata Motors', company_code: 'TATAMOTORS', stocks_owned: 800, purchase_price: 450 }
  ],
  mutual_funds: [
    { fund_name: 'HDFC Equity Fund', investment_amount: 500000 },
    { fund_name: 'SBI Bluechip Fund', investment_amount: 400000 }
  ],
  real_estate: [
    { type: 'Supermarket Premises', location: 'Bangalore', value: 15000000 }
  ],
  gold_bonds: [
    { issuer: 'RBI', grams: 200, purchase_price: 5000 }
  ]
};

const InvestmentDashboard = () => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'stocks':
        return <TrendingUp size={18} className="text-green-500" />;
      case 'mutual_funds':
        return <Banknote size={18} className="text-blue-500" />;
      case 'real_estate':
        return <Home size={18} className="text-purple-500" />;
      case 'gold_bonds':
        return <Gem size={18} className="text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Investment Portfolio</h2>
        <button className="text-sm flex items-center text-primary">
          <Plus size={16} className="mr-1" />
          Add Investment
        </button>
      </div>
      
      <div className="space-y-6">
        {Object.keys(investments).map((category) => (
          <div key={category}>
            <h3 className="text-md font-medium mb-2 flex items-center">
              {getCategoryIcon(category)}
              <span className="ml-2 capitalize">{category.replace('_', ' ')}</span>
            </h3>
            <div className="space-y-3">
              {investments[category].map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors flex items-center justify-between">
                  <div>
                    {category === 'stocks' && (
                      <>
                        <h4 className="font-medium">{item.company} ({item.company_code})</h4>
                        <p className="text-sm text-muted-foreground">{item.stocks_owned} shares @ ₹{item.purchase_price}</p>
                      </>
                    )}
                    {category === 'mutual_funds' && (
                      <>
                        <h4 className="font-medium">{item.fund_name}</h4>
                        <p className="text-sm text-muted-foreground">Investment: ₹{item.investment_amount.toLocaleString()}</p>
                      </>
                    )}
                    {category === 'real_estate' && (
                      <>
                        <h4 className="font-medium">{item.type}</h4>
                        <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                      </>
                    )}
                    {category === 'gold_bonds' && (
                      <>
                        <h4 className="font-medium">{item.issuer} Gold Bonds</h4>
                        <p className="text-sm text-muted-foreground">{item.grams}g @ ₹{item.purchase_price}</p>
                      </>
                    )}
                  </div>
                  <StatusBadge status="info" label="Active" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full py-2 border border-dashed border-muted-foreground/30 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
        View Full Portfolio
      </button>
    </AnimatedCard>
  );
};

export default InvestmentDashboard;
