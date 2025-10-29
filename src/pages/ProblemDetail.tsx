import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Problem {
  id: string;
  title: string;
  description: string;
  solution: string;
  explanation: string;
  reference_link: string | null;
  youtube_explanation_link: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created_at: string;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

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
          description: 'The requested problem does not exist',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setProblem(data as Problem);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load problem',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (problem) {
      navigator.clipboard.writeText(problem.solution);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="code-loader" />
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problems
          </Button>

          {/* Problem Header */}
          <div className="glass-card mb-8 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${difficultyColors[problem.difficulty]} border`}>
                {problem.difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(problem.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-6 gradient-text">
              {problem.title}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {problem.description}
              </p>
            </div>
          </div>

          {/* Solution Section */}
          <div className="glass-card mb-8 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Solution</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language="javascript"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                {problem.solution}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Explanation Section */}
          <div className="glass-card mb-8 animate-fade-in-scale">
            <h2 className="text-2xl font-semibold mb-4">Explanation</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {problem.explanation}
              </p>
            </div>
          </div>

          {/* Reference Links */}
          {(problem.reference_link || problem.youtube_explanation_link) && (
            <div className="glass-card animate-fade-in-scale">
              <h2 className="text-xl font-semibold mb-3">Additional Resources</h2>
              <div className="flex flex-col gap-3">
                {problem.reference_link && (
                  <a
                    href={problem.reference_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Original Problem
                  </a>
                )}
                {problem.youtube_explanation_link && (
                  <a
                    href={problem.youtube_explanation_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch YouTube Explanation
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
