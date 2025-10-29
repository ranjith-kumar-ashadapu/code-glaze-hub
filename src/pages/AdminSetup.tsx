import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4">
      <Card className="glass-card max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            Admin Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            To access admin features, you need to be assigned an admin role.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">How to assign admin role:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open your backend dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Run this SQL command (replace YOUR_USER_ID with your actual user ID):</li>
            </ol>
            
            <div className="bg-card rounded border p-3 font-mono text-xs overflow-x-auto mt-3">
              <code className="text-primary">
                INSERT INTO public.user_roles (user_id, role)<br />
                VALUES ('YOUR_USER_ID', 'admin');
              </code>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Your User ID: <code className="bg-card px-2 py-1 rounded">{user?.id}</code>
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Once the admin role is assigned, refresh this page to access the admin dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
