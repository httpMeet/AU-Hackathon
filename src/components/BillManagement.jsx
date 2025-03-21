import React from 'react';
import { Clock, Zap, Home, Wifi, Phone, Plus } from 'lucide-react';
import AnimatedCard from './AnimatedCard';
import StatusBadge from './StatusBadge';

const upcomingBills = [
  {
    id: 1,
    name: 'Electricity Bill',
    amount: 145.00,
    dueDate: '2023-06-15',
    category: 'utilities',
    status: 'upcoming',
    autopay: true,
  },
  {
    id: 2,
    name: 'Mortgage Payment',
    amount: 1850.00,
    dueDate: '2023-06-20',
    category: 'housing',
    status: 'upcoming',
    autopay: true,
  },
  {
    id: 3,
    name: 'Internet Service',
    amount: 79.99,
    dueDate: '2023-06-22',
    category: 'utilities',
    status: 'upcoming',
    autopay: false,
  },
  {
    id: 4,
    name: 'Phone Bill',
    amount: 85.00,
    dueDate: '2023-06-25',
    category: 'utilities',
    status: 'upcoming',
    autopay: true,
  },
];

const BillManagement = () => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'utilities':
        return <Zap size={18} className="text-amber-500" />;
      case 'housing':
        return <Home size={18} className="text-blue-500" />;
      case 'internet':
        return <Wifi size={18} className="text-purple-500" />;
      case 'phone':
        return <Phone size={18} className="text-green-500" />;
      default:
        return <Clock size={18} className="text-gray-500" />;
    }
  };
  
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Upcoming Bills</h2>
        <button className="text-sm flex items-center text-primary">
          <Plus size={16} className="mr-1" />
          Add Bill
        </button>
      </div>
      
      <div className="space-y-4">
        {upcomingBills.map((bill) => {
          const daysRemaining = getDaysRemaining(bill.dueDate);
          
          return (
            <div 
              key={bill.id}
              className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors flex items-center"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                {getCategoryIcon(bill.category)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{bill.name}</h3>
                  {bill.autopay && (
                    <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Autopay
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Due {new Date(bill.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-semibold">${bill.amount.toFixed(2)}</span>
                <div className="mt-1">
                  <StatusBadge 
                    status={daysRemaining <= 3 ? 'warning' : 'info'} 
                    label={daysRemaining <= 0 ? 'Due today' : `${daysRemaining} days left`} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="mt-6 w-full py-2 border border-dashed border-muted-foreground/30 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
        View All Bills
      </button>
    </AnimatedCard>
  );
};

export default BillManagement; 