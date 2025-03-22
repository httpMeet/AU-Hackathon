import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {

    // Clear all local storage
    localStorage.clear();
  
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={Logo} 
            alt="BudgetWise Logo" 
            className="h-16 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/dashboard" className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/80 hover:text-primary'} transition-colors`}>
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Accounts</a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Transactions</a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Insights</a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Planning</a>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button className="p-2 rounded-full text-foreground/70 hover:bg-muted transition-colors">
                <Search size={18} />
              </button>
              <button className="p-2 rounded-full text-foreground/70 hover:bg-muted transition-colors">
                <Bell size={18} />
              </button>
              <div className="relative">
                <div 
                  className="hidden md:flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded-full transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    <User size={16} className="text-foreground/70" />
                  </div>
                  <ChevronDown size={14} className="text-foreground/60" />
                </div>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 py-1">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{localStorage.getItem('user_name') || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{localStorage.getItem('user_email') || 'user@example.com'}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        Settings
                      </div>
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <button 
                className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && isLoggedIn && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 absolute left-0 right-0 mx-4 animate-appear">
          <nav className="flex flex-col space-y-3">
            <a href="/dashboard" className={`text-sm font-medium p-2 hover:bg-muted rounded transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}>Dashboard</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Accounts</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Transactions</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Insights</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Planning</a>
            <hr className="border-border" />
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Profile</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-muted rounded transition-colors">Settings</a>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium p-2 text-left text-destructive hover:bg-destructive/10 rounded transition-colors"
            >
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar; 