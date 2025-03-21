import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.substring(1); // Remove leading slash
  const pageName = path.charAt(0).toUpperCase() + path.slice(1); // Capitalize first letter

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-4xl mx-auto text-center">
        <div className="mb-6 inline-block p-4 rounded-full bg-primary/10">
          <h1 className="text-4xl font-bold text-foreground mb-2">{pageName} Page</h1>
          <p className="text-xl text-foreground mb-8">
            This page is under construction and will be available soon.
          </p>
        </div>

        <Button onClick={() => navigate(-1)} variant="outline" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 