import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import CategoryCard from '@/components/CategoryCard';
import { Search, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string | null;
  created_at: string;
}
const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
};
const Home = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryCards, setShowCategoryCards] = useState(true);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    category: categorySlug
  } = useParams();
  useEffect(() => {
    fetchProblems();
  }, []);
  useEffect(() => {
    if (categorySlug) {
      const decodedCategory = categorySlug.replace(/-/g, ' ');
      const matchingCategory = categories.find(cat => cat.toLowerCase() === decodedCategory.toLowerCase());
      if (matchingCategory) {
        setCategoryFilter(matchingCategory);
        setShowCategoryCards(false);
      }
    } else {
      // Reset filters when navigating to /home
      setCategoryFilter('all');
      setSearchQuery('');
      setDifficultyFilter('all');
    }
  }, [categorySlug, categories]);
  useEffect(() => {
    filterProblems();
    setShowCategoryCards(!searchQuery && difficultyFilter === 'all' && categoryFilter === 'all' && !categorySlug);
  }, [problems, searchQuery, difficultyFilter, categoryFilter, categorySlug]);
  const fetchProblems = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('problems').select('id, title, description, difficulty, category, created_at').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const problemsData = (data || []) as Problem[];
      setProblems(problemsData);

      // Fetch categories from categories table
      const {
        data: categoriesData
      } = await supabase.from('categories').select('name').order('created_at', {
        ascending: false
      });
      const uniqueCategories = categoriesData?.map(c => c.name) || [];
      setCategories(uniqueCategories);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load problems',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const filterProblems = () => {
    let filtered = [...problems];
    if (searchQuery) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    setFilteredProblems(filtered);
  };
  return <div className="min-h-screen">
      <Navigation className="bg-purple-200" />

      {/* Filters Section */}
      <section className="pt-32 pb-6 px-6 md:px-8 bg-purple-400">
        <div className="container max-w-[1440px] mx-0 my-[25px]">
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 animate-fade-in-scale">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search problems..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-5 glass-card h-12 text-[15px] placeholder:text-muted-foreground/60 
                  shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10
                  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 
                  focus-visible:border-primary focus-visible:shadow-xl focus-visible:shadow-primary/10 transition-all duration-200" />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="glass-card h-12 px-4 text-[15px] shadow-lg shadow-primary/5 hover:bg-muted/30 hover:shadow-xl hover:shadow-primary/10 transition-all data-[state=open]:bg-primary/5 data-[state=open]:text-primary data-[state=open]:border-primary/30 data-[state=open]:shadow-xl data-[state=open]:shadow-primary/10">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-card border-border shadow-xl">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="glass-card h-12 px-4 text-[15px] shadow-lg shadow-primary/5 hover:bg-muted/30 hover:shadow-xl hover:shadow-primary/10 transition-all data-[state=open]:bg-primary/5 data-[state=open]:text-primary data-[state=open]:border-primary/30 data-[state=open]:shadow-xl data-[state=open]:shadow-primary/10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-card border-border shadow-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {/* Hero Description */}
          <div className="text-center max-w-4xl mx-auto mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">
              Browse by Category
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Explore curated coding problems with detailed solutions, explanations, and references. Built for developers who want to excel.
            </p>
            <div className="mt-6 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-50" />
          </div>
        </div>
      </section>

      {/* Category Cards */}
      {showCategoryCards && !loading && categories.length > 0 && <section className="pb-20 px-6 bg-violet-500 my-0">
          <div className="container mx-auto max-w-[1440px] my-0 py-[25px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 xl:gap-10 animate-fade-in">
              {categories.map(category => {
            const categoryProblems = problems.filter(p => p.category === category);
            const count = categoryProblems.length;
            const difficultyCounts = {
              Easy: categoryProblems.filter(p => p.difficulty === 'Easy').length,
              Medium: categoryProblems.filter(p => p.difficulty === 'Medium').length,
              Hard: categoryProblems.filter(p => p.difficulty === 'Hard').length
            };
            return <CategoryCard key={category} category={category} problemCount={count} difficultyCounts={difficultyCounts} />;
          })}
            </div>
          </div>
        </section>}

      {/* Problems Index Table */}
      <section className="pb-20 px-6 md:px-8 bg-violet-500">
        <div className="container mx-auto max-w-[1440px]">
          {loading ? <div className="flex items-center justify-center py-20">
              <div className="code-loader" />
            </div> : !showCategoryCards && filteredProblems.length > 0 ? <div className="glass-card overflow-hidden animate-fade-in">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="w-32">Difficulty</TableHead>
                    <TableHead className="hidden sm:table-cell w-32">Category</TableHead>
                    <TableHead className="hidden lg:table-cell w-40">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProblems.map((problem, index) => {
                const date = new Date(problem.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const preview = problem.description.length > 100 ? problem.description.substring(0, 100) + '...' : problem.description;
                const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                const catSlug = problem.category ? problem.category.toLowerCase().replace(/\s+/g, '-') : 'uncategorized';
                return <TableRow key={problem.id} className="cursor-pointer border-border/50 hover:bg-accent/50 transition-colors" onClick={() => navigate(`/${catSlug}/${slug}`)}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {problem.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {preview}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${difficultyColors[problem.difficulty]} border`}>
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {problem.category ? <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {problem.category}
                            </Badge> : <span className="text-muted-foreground text-xs">N/A</span>}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {date}
                        </TableCell>
                      </TableRow>;
              })}
                </TableBody>
              </Table>
            </div> : !showCategoryCards ? <div className="text-center py-20">
              <Code2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No problems found</h3>
              <p className="text-muted-foreground">
                {searchQuery || difficultyFilter !== 'all' || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Check back soon for new problems'}
              </p>
            </div> : null}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 md:px-8 bg-purple-600">
        <div className="container mx-auto max-w-[1440px] text-center text-sm text-muted-foreground">
          <p className="text-lg font-semibold text-slate-50">© 2025 CodeGrid. Built with passion for developers.</p>
        </div>
      </footer>
    </div>;
};
export default Home;