import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('hasCompletedOnboarding');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </a>
        </div>

        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/dashboard" 
              className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/80 hover:text-primary'} transition-colors`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              Dashboard
            </a>
            <a 
              href="/insights"
              onClick={(e) => {
                e.preventDefault();
                navigate('/insights');
              }}
              className={`text-sm font-medium ${location.pathname === '/insights' ? 'text-primary' : 'text-foreground/80 hover:text-primary'} transition-colors`}
            >
              Insights
            </a>
            <a 
              href="/smart-contracts"
              onClick={(e) => {
                e.preventDefault();
                navigate('/smart-contracts');
              }}
              className={`text-sm font-medium ${location.pathname === '/smart-contracts' ? 'text-primary' : 'text-foreground/80 hover:text-primary'} transition-colors`}
            >
              Smart Contracts
            </a>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                Sign Out
              </Button>
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && isLoggedIn && (
        <div className="md:hidden bg-background border border-border shadow-lg rounded-lg mt-2 p-4 absolute left-0 right-0 mx-4">
          <nav className="flex flex-col space-y-3">
            <a 
              href="/dashboard" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
                setIsMenuOpen(false);
              }}
              className={`text-sm font-medium p-2 hover:bg-muted rounded transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}
            >
              Dashboard
            </a>
            <a 
              href="/insights"
              onClick={(e) => {
                e.preventDefault();
                navigate('/insights');
                setIsMenuOpen(false);
              }}
              className={`text-sm font-medium p-2 hover:bg-muted rounded transition-colors ${location.pathname === '/insights' ? 'text-primary' : ''}`}
            >
              Insights
            </a>
            <a 
              href="/smart-contracts"
              onClick={(e) => {
                e.preventDefault();
                navigate('/smart-contracts');
                setIsMenuOpen(false);
              }}
              className={`text-sm font-medium p-2 hover:bg-muted rounded transition-colors ${location.pathname === '/smart-contracts' ? 'text-primary' : ''}`}
            >
              Smart Contracts
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 