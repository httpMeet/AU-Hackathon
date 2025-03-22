import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TransactionHistory from '@/components/TransactionHistory';
import BillManagement from '@/components/BillManagement';
import CreditScore from '@/components/CreditScore';
import AIChatbot from '@/components/AIChatbot';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // Add a slight delay to elements for staggered animation effect
    const animatableElements = document.querySelectorAll('.animate-appear');
    animatableElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('opacity-0');
      }, index * 100);
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-1 gap-10">          
          {/* Bills and Credit Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-appear opacity-0">
            <BillManagement />
            <CreditScore />
          </section>
          
          {/* Transactions Section */}
          <section className="animate-appear opacity-0">
            <TransactionHistory />
          </section>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary mr-2 flex items-center justify-center">
                <span className="text-white font-semibold">B</span>
              </div>
              <span className="text-sm font-medium">BudgetWise</span>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © 2023 BudgetWise. All rights reserved.
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chatbot Component */}
      <AIChatbot />
    </div>
  );
};

export default Dashboard; 