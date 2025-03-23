import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../assets/logo.png';

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
          <>
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="/dashboard" 
                className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
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
                className={`text-sm font-medium ${location.pathname === '/insights' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                Insights
              </a>
              <a 
                href="/smart-contracts"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/smart-contracts');
                }}
                className={`text-sm font-medium ${location.pathname === '/smart-contracts' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                Smart Contracts
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
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

      {/* Mobile menu */}
      {isMenuOpen && isLoggedIn && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a 
              href="/dashboard" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
                setIsMenuOpen(false);
              }}
              className={`text-sm font-medium p-2 rounded ${location.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
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
              className={`text-sm font-medium p-2 rounded ${location.pathname === '/insights' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
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
              className={`text-sm font-medium p-2 rounded ${location.pathname === '/smart-contracts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Smart Contracts
            </a>
            <Button 
              variant="ghost" 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full justify-center"
            >
              Log Out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 