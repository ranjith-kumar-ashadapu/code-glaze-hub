import { Card, CardContent } from '@/components/ui/card';
import { Code2, Database, Binary, Braces, FileCode, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  category: string;
  problemCount: number;
  difficultyCounts: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
}

const categoryIcons: { [key: string]: any } = {
  'Arrays': Binary,
  'Strings': FileCode,
  'Trees': GitBranch,
  'Graphs': Database,
  'Dynamic Programming': Braces,
};

const CategoryCard = ({ category, problemCount, difficultyCounts }: CategoryCardProps) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[category] || Code2;

  return (
    <Card 
      className="glass-card glass-hover cursor-pointer group border-border/50"
      onClick={() => navigate(`/${category.toLowerCase().replace(/\s+/g, '-')}`)}
    >
      <CardContent className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{category}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {problemCount} {problemCount === 1 ? 'problem' : 'problems'}
        </p>
        <div className="flex items-center justify-center gap-2">
          {difficultyCounts.Easy > 0 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                {difficultyCounts.Easy}
              </span>
            </div>
          )}
          {difficultyCounts.Medium > 0 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                {difficultyCounts.Medium}
              </span>
            </div>
          )}
          {difficultyCounts.Hard > 0 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                {difficultyCounts.Hard}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
