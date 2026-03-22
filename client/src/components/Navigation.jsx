import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

const Navigation = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto
          ${isScrolled 
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
          <span 
            className="hidden sm:block text-2xl tracking-tight text-primary antialiased" 
            style={{ fontFamily: '"Fraunces", serif', fontWeight: 800 }}
          >
            Sanctuary
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Button variant={currentPath === '/' ? 'ghost' : 'outline'} size="sm" onClick={() => navigate('/')} className="hidden md:inline-flex">Home</Button>
              <Button variant={currentPath === '/dashboard' ? 'primary' : 'ghost'} size="sm" onClick={handleLibraryClick}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="!border-border hover:!border-destructive hover:!text-destructive hover:!bg-destructive/10">Depart</Button>
            </>
          ) : (
            <>
              <Button variant={currentPath === '/' ? 'primary' : 'ghost'} size="sm" onClick={() => navigate('/')} className="hidden md:inline-flex">Home</Button>
              <Button variant={currentPath === '/login' ? 'primary' : 'ghost'} size="sm" onClick={() => navigate('/login')}>Sign In</Button>
              <Button size="sm" onClick={() => navigate('/register')} variant={currentPath === '/register' ? 'primary' : 'outline'} className="shadow-sm">Plant Roots</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;