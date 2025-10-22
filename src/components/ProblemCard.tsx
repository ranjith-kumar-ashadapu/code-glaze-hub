import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const ProblemCard = ({ id, title, description, difficulty, createdAt }: ProblemCardProps) => {
  const preview = description.length > 120 ? description.substring(0, 120) + '...' : description;
  const date = new Date(createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <Link to={`/problem/${id}`}>
      <div className="glass-card glass-hover cursor-pointer group h-full animate-fade-in-scale">
        <div className="flex items-start justify-between mb-4">
          <Badge className={`${difficultyColors[difficulty]} border`}>
            {difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {date}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-all">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {preview}
        </p>

        <div className="mt-4 pt-4 border-t border-border/50">
          <span className="text-sm font-medium text-primary group-hover:underline">
            View Solution →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
