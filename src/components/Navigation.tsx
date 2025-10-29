import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, LogIn, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Logo positioned absolutely at top-left */}
      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center gap-2 group glass-card px-4 py-3 animate-fade-in">
        <Code2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
        <span className="text-xl font-bold gradient-text">CodeGrid</span>
      </Link>

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