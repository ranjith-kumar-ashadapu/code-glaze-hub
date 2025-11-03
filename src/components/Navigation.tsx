import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Combined Logo and Category Navigation - positioned at top-left */}
      <nav className="fixed top-6 left-6 z-50 flex items-center gap-4 glass-card px-4 py-3 animate-fade-in">
        <Link to="/home" className="flex flex-col gap-1 group border-r border-border/50 pr-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold gradient-text">CodeGrid</span>
          </div>
          <span className="text-xs text-muted-foreground">Master the logic</span>
        </Link>
        
        {/* Mobile hamburger menu */}
        {categories.length > 0 && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
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
          <div className="hidden lg:flex items-center gap-4">
            {categories.map(category => (
              <Link
                key={category}
                to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Admin actions positioned at top-right */}
      {user && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="gap-2 glass-card"
          >
            <Plus className="h-4 w-4" />
            Admin
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 glass-card"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}
    </>
  );
};

export default Navigation;