import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Plus, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            image_url: formData.image_url || null,
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            image_url: formData.image_url || null,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }

      setFormData({ name: '', image_url: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      image_url: category.image_url || '',
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });

      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', image_url: '' });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Category' : 'Add New Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Arrays, Strings, Dynamic Programming"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.png"
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default icon (&lt;/&gt;)
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="gap-2">
                {editingId ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Update Category
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Category
                  </>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="code-loader" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-10 w-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Code2 
                      className={`h-10 w-10 text-primary ${category.image_url ? 'hidden' : ''}`}
                    />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(category.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card text-center py-10">
          <CardContent>
            <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No categories yet. Add one above!</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManagement;
