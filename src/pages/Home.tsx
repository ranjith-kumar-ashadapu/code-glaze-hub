import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProblemCard from '@/components/ProblemCard';
import Navigation from '@/components/Navigation';
import { Search, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created_at: string;
}

const Home = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchQuery, difficultyFilter]);

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('id, title, description, difficulty, created_at')
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

  const filterProblems = () => {
    let filtered = [...problems];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }

    setFilteredProblems(filtered);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl glass-card mb-6 animate-fade-in">
            <Code2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in">
            Master Coding Interviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
            Explore curated coding problems with detailed solutions, explanations, and references.
            Built for developers who want to excel.
          </p>

          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 animate-fade-in-scale">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card h-12"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="glass-card h-12">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Problems Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-64 animate-pulse" />
              ))}
            </div>
          ) : filteredProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem, index) => (
                <div key={problem.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProblemCard
                    id={problem.id}
                    title={problem.title}
                    description={problem.description}
                    difficulty={problem.difficulty}
                    createdAt={problem.created_at}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Code2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No problems found</h3>
              <p className="text-muted-foreground">
                {searchQuery || difficultyFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Check back soon for new problems'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 CodeGrid. Built with passion for developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
