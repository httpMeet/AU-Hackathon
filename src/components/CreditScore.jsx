import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

const creditFactors = [
  {
    name: 'Payment History',
    score: 'Excellent',
    value: 99,
    impact: 'Very high impact',
  },
  {
    name: 'Credit Utilization',
    score: 'Good',
    value: 72,
    impact: 'High impact',
    trend: 'up',
  },
  {
    name: 'Credit Age',
    score: 'Fair',
    value: 68,
    impact: 'Medium impact',
    trend: 'up',
  },
  {
    name: 'Total Accounts',
    score: 'Good',
    value: 82,
    impact: 'Low impact',
  },
  {
    name: 'Recent Inquiries',
    score: 'Good',
    value: 85,
    impact: 'Low impact',
    trend: 'down',
  },
];

const CreditScore = () => {
  const score = 742;
  const scoreMax = 850;
  const scorePercent = (score / scoreMax) * 100;
  
  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 670) return 'text-blue-500';
    if (score >= 580) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreRange = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };
  
  const getBarColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-blue-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Credit Score</h2>
        <button className="text-sm flex items-center text-primary">
          View Report
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="12" 
              />
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="12" 
                strokeDasharray={`${2 * Math.PI * 54 * scorePercent / 100} ${2 * Math.PI * 54 * (100 - scorePercent) / 100}`}
                strokeDashoffset={2 * Math.PI * 54 * 0.25}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-xs text-muted-foreground">{getScoreRange(score)}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">Score Range: 300-850</div>
            <div className="text-sm text-muted-foreground">Last updated: June 5, 2023</div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-4">
          <div className="text-sm font-medium mb-2">Credit Factors</div>
          {creditFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm">{factor.name}</span>
                  <Info size={14} className="ml-1 text-muted-foreground cursor-help" />
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">{factor.score}</span>
                  {factor.trend === 'up' && <ArrowUpRight size={14} className="ml-1 text-green-500" />}
                  {factor.trend === 'down' && <ArrowDownRight size={14} className="ml-1 text-red-500" />}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBarColor(factor.value)} rounded-full`}
                  style={{ width: `${factor.value}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{factor.impact}</span>
                <span>{factor.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CreditScore; 