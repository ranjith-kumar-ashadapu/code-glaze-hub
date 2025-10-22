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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <Code2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold gradient-text">CodeGrid</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Admin
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            // The following code block has been removed to eliminate the 'Admin Login' button:
            // <Button
            //   variant="default"
            //   size="sm"
            //   onClick={() => navigate('/auth')}
            //   className="gap-2"
            // >
            //   <LogIn className="h-4 w-4" />
            //   Admin Login
            // </Button>
            null // You can replace the removed block with 'null' or an empty fragment <> </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;