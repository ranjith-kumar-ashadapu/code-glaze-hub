import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const problemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().trim().min(1, 'Description is required'),
  solution: z.string().trim().min(1, 'Solution is required'),
  explanation: z.string().trim().min(1, 'Explanation is required'),
  reference_link: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  youtube_explanation_link: z.string().trim().url('Invalid YouTube URL').optional().or(z.literal('')),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

const AdminForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    solution: '',
    explanation: '',
    reference_link: '',
    youtube_explanation_link: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);

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
    if (id && user && isAdmin) {
      fetchProblem();
    }
  }, [id, user, isAdmin]);

  const fetchProblem = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: 'Problem not found',
          variant: 'destructive',
        });
        navigate('/admin');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        solution: data.solution,
        explanation: data.explanation,
        reference_link: data.reference_link || '',
        youtube_explanation_link: data.youtube_explanation_link || '',
        difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load problem',
        variant: 'destructive',
      });
      navigate('/admin');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validation = problemSchema.safeParse(formData);
      if (!validation.success) {
        toast({
          title: 'Validation Error',
          description: validation.error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }

      const dataToSave = {
        title: validation.data.title,
        description: validation.data.description,
        solution: validation.data.solution,
        explanation: validation.data.explanation,
        difficulty: validation.data.difficulty,
        reference_link: validation.data.reference_link || null,
        youtube_explanation_link: validation.data.youtube_explanation_link || null,
      };

      if (id) {
        const { error } = await supabase
          .from('problems')
          .update(dataToSave)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success!',
          description: 'Problem updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('problems')
          .insert([dataToSave]);

        if (error) throw error;

        toast({
          title: 'Success!',
          description: 'Problem created successfully',
        });
      }

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save problem',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || fetchLoading || !user || !isAdmin) {
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
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">
                {id ? 'Edit Problem' : 'Add New Problem'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Problem Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Two Sum"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: 'Easy' | 'Medium' | 'Hard') =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem in detail..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution Code *</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="function twoSum(nums, target) { ... }"
                    rows={12}
                    className="font-mono text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation *</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explain the approach and complexity..."
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_link">Reference Link (optional)</Label>
                  <Input
                    id="reference_link"
                    type="url"
                    value={formData.reference_link}
                    onChange={(e) => setFormData({ ...formData, reference_link: e.target.value })}
                    placeholder="https://leetcode.com/problems/two-sum/"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_explanation_link">YouTube Explanation Link (optional)</Label>
                  <Input
                    id="youtube_explanation_link"
                    type="url"
                    value={formData.youtube_explanation_link}
                    onChange={(e) => setFormData({ ...formData, youtube_explanation_link: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {id ? 'Update Problem' : 'Publish Problem'}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminForm;
