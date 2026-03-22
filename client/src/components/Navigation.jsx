import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react'; // Added Menu and X icons
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

const Navigation = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: Mobile menu state

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close menu when scrolling down
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu automatically when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLibraryClick = () => {
    if (currentPath === '/dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className={`fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 sm:px-6 pointer-events-none transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
      <div 
        className={`
          flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto relative z-50
          ${isScrolled || isMobileMenuOpen
            ? 'py-3 bg-[#FDFCF8]/90 backdrop-blur-md border border-border/50 rounded-full shadow-soft' 
            : 'py-4 bg-transparent border-transparent rounded-full shadow-none'}
        `}
      >
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Leaf size={20} />
          </div>
          {/* We now show the text on all screens so the logo feels balanced! */}
          <span 
            className="text-2xl tracking-tight text-primary antialiased" 
            style={{ fontFamily: '"Fraunces", serif', fontWeight: 800 }}
          >
            Sanctuary
          </span>
        </div>
        
        {/* DESKTOP MENU (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button variant={currentPath === '/' ? 'ghost' : 'outline'} size="sm" onClick={() => navigate('/')}>Home</Button>
              <Button variant={currentPath === '/dashboard' ? 'primary' : 'ghost'} size="sm" onClick={handleLibraryClick}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="!border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">Depart</Button>
            </>
          ) : (
            <>
              <Button variant={currentPath === '/' ? 'primary' : 'ghost'} size="sm" onClick={() => navigate('/')}>Home</Button>
              <Button variant={currentPath === '/login' ? 'primary' : 'ghost'} size="sm" onClick={() => navigate('/login')}>Sign In</Button>
              <Button size="sm" onClick={() => navigate('/register')} variant={currentPath === '/register' ? 'primary' : 'outline'} className="shadow-sm">Plant Roots</Button>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE (Hidden on Desktop) */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN PANEL */}
      <div 
        className={`
          md:hidden absolute top-full left-4 right-4 mt-2 p-6 bg-[#FDFCF8]/95 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-float transition-all duration-300 origin-top pointer-events-auto
          ${isMobileMenuOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'}
        `}
      >
        <div className="flex flex-col gap-4">
          {user ? (
            <>
              <Button variant={currentPath === '/' ? 'primary' : 'ghost'} onClick={() => navigate('/')} className="w-full justify-start text-lg h-14">Home</Button>
              <Button variant={currentPath === '/dashboard' ? 'primary' : 'ghost'} onClick={handleLibraryClick} className="w-full justify-start text-lg h-14">Dashboard</Button>
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-lg h-14 !border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">Depart</Button>
            </>
          ) : (
            <>
              <Button variant={currentPath === '/' ? 'primary' : 'ghost'} onClick={() => navigate('/')} className="w-full justify-start text-lg h-14">Home</Button>
              <Button variant={currentPath === '/login' ? 'primary' : 'ghost'} onClick={() => navigate('/login')} className="w-full justify-start text-lg h-14">Sign In</Button>
              <Button onClick={() => navigate('/register')} variant={currentPath === '/register' ? 'primary' : 'outline'} className="w-full justify-start text-lg h-14 shadow-sm">Plant Roots</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;