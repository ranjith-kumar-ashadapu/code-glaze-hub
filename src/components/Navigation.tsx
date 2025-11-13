import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LogOut, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('problems')
      .select('category');
    
    if (data) {
      const uniqueCategories = Array.from(
        new Set(data.map(p => p.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/home');
  };

  const isActiveCategory = (category: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    return location.pathname === `/${categorySlug}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-card mx-4 my-2 px-6 py-1 animate-fade-in transition-all duration-300 ${
      isScrolled ? 'shadow-2xl shadow-primary/10' : ''
    }`}>
      <div className="flex items-center justify-between">
        {/* Left side: Logo and Categories */}
        <div className="flex items-center gap-6">
          <Link to="/home" className="flex flex-col gap-0.5 group border-r border-border/50 pr-6 py-0.5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2">
              <Code2 className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold gradient-text">CodeGrid</span>
            </div>
            <span className="text-[15px] font-medium text-muted-foreground">Master the logic</span>
          </Link>
          
          {/* Mobile hamburger menu */}
          {categories.length > 0 && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden gap-2">
                  <Menu className="h-5 w-5" />
                  <span>Categories</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {categories.map(category => (
                    <Link
                      key={category}
                      to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-4 text-center rounded-lg glass-card hover:bg-accent transition-colors"
                    >
                      <span className="text-sm font-medium">{category}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop category links */}
          {categories.length > 0 && (
            <div className="hidden lg:flex items-center gap-6">
              {categories.map(category => {
                const isActive = isActiveCategory(category);
                return (
                  <Link
                    key={category}
                    to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`relative px-4 py-2 text-sm transition-all duration-200 rounded-lg
                      ${isActive 
                        ? 'text-primary bg-primary/5 font-bold' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent font-medium'
                      }
                      ${isActive ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary after:rounded-t-full' : ''}
                    `}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side: Theme toggle and Admin actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;