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
const categoryIcons: {
  [key: string]: any;
} = {
  'Arrays': Binary,
  'Strings': FileCode,
  'Trees': GitBranch,
  'Graphs': Database,
  'Dynamic Programming': Braces
};
const CategoryCard = ({
  category,
  problemCount,
  difficultyCounts
}: CategoryCardProps) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[category] || Code2;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Color-coded badge based on problem count
  const getBadgeColor = () => {
    if (problemCount <= 2) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800';
    if (problemCount <= 5) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800';
    return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800';
  };
  useEffect(() => {
    const fetchCategoryImage = async () => {
      const {
        data
      } = await supabase.from('categories').select('image_url').eq('name', category).maybeSingle();
      if (data?.image_url) {
        setImageUrl(data.image_url);
      }
    };
    fetchCategoryImage();
  }, [category]);
  return <Card onClick={() => navigate(`/${category.toLowerCase().replace(/\s+/g, '-')}`)} className="glass-card cursor-pointer group border-border/50 overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] md:aspect-square flex flex-col min-h-[320px] mx-0 px-0 py-0">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image section - 75% of card - hidden on mobile */}
        <div className="relative hidden md:flex flex-[3] bg-primary/10 overflow-hidden">
          {imageUrl && !imageError ? <img src={imageUrl} alt={category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={() => setImageError(true)} /> : <div className="w-full h-full flex items-center justify-center">
              <Icon className="w-20 h-20 text-primary" />
            </div>}
        </div>
        
        {/* Info section - full height on mobile, 25% on desktop */}
        <div className="flex-1 p-5 flex flex-col justify-center items-center md:items-start md:flex-[1]">
          <h3 className="text-xl font-semibold mb-2 text-center md:text-left">{category}</h3>
          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-semibold border mb-3 shadow-sm ${getBadgeColor()}`}>
            {problemCount} {problemCount === 1 ? 'problem' : 'problems'}
          </div>
          <div className="flex items-center gap-1.5">
            {difficultyCounts.Easy > 0 && <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  {difficultyCounts.Easy}
                </span>
              </div>}
            {difficultyCounts.Medium > 0 && <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                  {difficultyCounts.Medium}
                </span>
              </div>}
            {difficultyCounts.Hard > 0 && <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                  {difficultyCounts.Hard}
                </span>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default CategoryCard;