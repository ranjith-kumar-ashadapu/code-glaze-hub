import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created_at: string;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!roleLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/admin-setup');
      }
    }
  }, [user, isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProblems();
    }
  }, [user, isAdmin]);

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('id, title, difficulty, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProblems((data || []) as Problem[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load problems',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Problem deleted successfully',
      });

      setProblems(problems.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete problem',
        variant: 'destructive',
      });
    }
  };

  if (roleLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="code-loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your coding problems</p>
            </div>
            <Button onClick={() => navigate('/admin/new')} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Problem
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="code-loader" />
            </div>
          ) : problems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-fade-in-scale">
              {problems.map((problem) => (
                <Card key={problem.id} className="glass-card glass-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{problem.title}</CardTitle>
                          <Badge className={`${difficultyColors[problem.difficulty]} border`}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(problem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                            navigate(`/problem/${slug}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/edit/${problem.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(problem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card text-center py-16">
              <CardContent>
                <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No problems yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first coding problem
                </p>
                <Button onClick={() => navigate('/admin/new')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Problem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Problem</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this problem? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
