import { Card, CardContent } from '@/components/ui/card';
import { Code2, Database, Binary, Braces, FileCode, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCategoryImage = async () => {
      const { data } = await supabase
        .from('categories')
        .select('image_url')
        .eq('name', category)
        .maybeSingle();
      
      if (data?.image_url) {
        setImageUrl(data.image_url);
      }
    };

    fetchCategoryImage();
  }, [category]);

  return (
    <Card 
      className="glass-card glass-hover cursor-pointer group border-border/50 overflow-hidden"
      onClick={() => navigate(`/${category.toLowerCase().replace(/\s+/g, '-')}`)}
    >
      <CardContent className="p-0">
        {/* Image section - 75% of card */}
        <div className="relative h-96 bg-primary/10 overflow-hidden">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={category}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="w-20 h-20 text-primary" />
            </div>
          )}
        </div>
        
        {/* Info section - 25% of card */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {problemCount} {problemCount === 1 ? 'problem' : 'problems'}
          </p>
          <div className="flex items-center gap-2">
            {difficultyCounts.Easy > 0 && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  {difficultyCounts.Easy}
                </span>
              </div>
            )}
            {difficultyCounts.Medium > 0 && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                  {difficultyCounts.Medium}
                </span>
              </div>
            )}
            {difficultyCounts.Hard > 0 && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                  {difficultyCounts.Hard}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
