import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  TrendingUp,
  Banknote,
  DollarSign,
  Search,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const transactions = [
  {
    id: 1,
    type: "stock_purchase",
    company: "Reliance Industries",
    category: "investment",
    date: "2024-02-15",
    amount: 1200000,
    status: "completed",
  },
  {
    id: 2,
    type: "stock_sell",
    company: "Tata Motors",
    category: "investment",
    date: "2024-03-01",
    amount: 320000,
    status: "completed",
  },
  {
    id: 3,
    type: "loan_payment",
    company:"Interest",
    category: "loan",
    date: "2024-01-25",
    amount: 500000,
    status: "completed",
  },
  {
    id: 4,
    type: "interest_received",
    source: "SBI FD",
    category: "income",
    date: "2024-03-10",
    amount: 30000,
    status: "completed",
  },
];

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.company &&
        transaction.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.source &&
        transaction.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (type) => {
    switch (type) {
      case "stock_purchase":
      case "stock_sell":
        return <TrendingUp size={16} className="text-green-500" />;
      case "loan_payment":
        return <Banknote size={16} className="text-red-500" />;
      case "interest_received":
        return <DollarSign size={16} className="text-blue-500" />;
      default:
        return <TrendingUp size={16} className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button className="text-sm flex items-center text-primary">
          See all transactions
        </button>
      </div>

      <div className="bg-white rounded-lg border border-border mb-6 p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full bg-muted/50 border-none rounded-lg focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/70 text-sm"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 flex items-center text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors">
            <Calendar size={16} className="mr-2" />
            <span>All Time</span>
            <ChevronDown size={16} className="ml-2" />
          </button>

          <button className="px-3 py-2 flex items-center text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors">
            <Filter size={16} className="mr-2" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-muted/30 border-b border-border text-sm grid grid-cols-12 gap-4">
          <div className="col-span-6">Transaction</div>
          <div className="col-span-2 text-right">Date</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-border">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/20 transition-colors"
              >
                <div className="col-span-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                    {getCategoryIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.company || transaction.source}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {transaction.type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 text-right text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="col-span-2 text-right font-medium">
                ₹{transaction.amount.toLocaleString()}
                </div>

                <div className="col-span-2 text-right">
                  <StatusBadge
                    status={transaction.status === "completed" ? "success" : "pending"}
                    label={transaction.status === "completed" ? "Completed" : "Pending"}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No transactions found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
