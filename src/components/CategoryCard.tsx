import { Card, CardContent } from '@/components/ui/card';
import { Code2, Database, Binary, Braces, FileCode, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  category: string;
  problemCount: number;
}

const categoryIcons: { [key: string]: any } = {
  'Arrays': Binary,
  'Strings': FileCode,
  'Trees': GitBranch,
  'Graphs': Database,
  'Dynamic Programming': Braces,
};

const CategoryCard = ({ category, problemCount }: CategoryCardProps) => {
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
        <p className="text-sm text-muted-foreground">
          {problemCount} {problemCount === 1 ? 'problem' : 'problems'}
        </p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
