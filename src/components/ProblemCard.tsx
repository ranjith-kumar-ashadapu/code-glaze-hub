import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
  category?: string | null;
}

const difficultyVariants = {
  Easy: 'success' as const,
  Medium: 'warning' as const,
  Hard: 'error' as const,
};

const ProblemCard = ({ id, title, description, difficulty, createdAt, category }: ProblemCardProps) => {
  const preview = description.length > 120 ? description.substring(0, 120) + '...' : description;
  const date = new Date(createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const catSlug = category ? category.toLowerCase().replace(/\s+/g, '-') : 'uncategorized';

  return (
    <Link to={`/${catSlug}/${slug}`}>
      <div className="glass-card glass-hover cursor-pointer group h-full animate-fade-in-scale">
        <div className="flex items-start justify-between mb-6">
          <Badge variant={difficultyVariants[difficulty]} className="text-sm px-3 py-1">
            {difficulty}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all leading-tight">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {preview}
        </p>

        <div className="mt-auto pt-6 border-t border-border/50">
          <span className="text-sm font-semibold text-primary group-hover:text-primary-hover transition-colors inline-flex items-center gap-2">
            View Solution
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
