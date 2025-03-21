import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

const expenseData = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 3450 },
  { month: 'Mar', amount: 3800 },
  { month: 'Apr', amount: 2900 },
  { month: 'May', amount: 3100 },
  { month: 'Jun', amount: 3600 },
];

const categoryData = [
  { name: 'Housing', value: 1200, color: '#4f46e5' },
  { name: 'Food', value: 800, color: '#06b6d4' },
  { name: 'Transport', value: 500, color: '#10b981' },
  { name: 'Shopping', value: 400, color: '#f59e0b' },
  { name: 'Bills', value: 350, color: '#ef4444' },
  { name: 'Other', value: 350, color: '#8b5cf6' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-border shadow-sm rounded-md">
        <p className="text-sm font-medium">{`${payload[0].payload.month} : $${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const CategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-border shadow-sm rounded-md">
        <p className="text-sm font-medium">{`${payload[0].name} : $${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const ExpenseChart = () => {
  const [timeRange, setTimeRange] = useState('6-months');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Monthly Expenses</h2>
          <button className="flex items-center text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
            <span>{timeRange === '6-months' ? 'Last 6 Months' : 'All Time'}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={expenseData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>
      
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Spending by Category</h2>
          <button className="flex items-center text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
            <span>This Month</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
        
        <div className="flex h-64">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-1/2 flex flex-col justify-center">
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {category.name}
                  </span>
                  <span className="ml-auto text-sm font-medium">
                    ${category.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ExpenseChart; 