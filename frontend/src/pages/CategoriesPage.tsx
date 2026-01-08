/**
 * Página de Categorias
 * CRUD de categorias para organizar memórias
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AppShell } from '../components/ui/AppShell';
import { GlassCard } from '../components/ui/GlassCard';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriesPageProps {
  onBack: () => void;
}

export function CategoriesPage({ onBack }: CategoriesPageProps) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  // Cores predefinidas
  const predefinedColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
  ];

  // Buscar categorias
  const fetchCategories = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await listCategories(accessToken, refreshAccessToken);
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Não quebrar a UI se houver erro
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, refreshAccessToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Criar categoria
  const handleCreate = async () => {
    if (!accessToken || !formData.name.trim()) return;
    try {
      const newCategory = await createCategory(accessToken, formData.name, formData.color, refreshAccessToken);
      setCategories([...categories, newCategory]);
      setFormData({ name: '', color: '#3B82F6' });
      setIsCreating(false);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  // Atualizar categoria
  const handleUpdate = async (id: string) => {
    if (!accessToken || !formData.name.trim()) return;
    try {
      const updated = await updateCategory(accessToken, id, formData.name, formData.color, refreshAccessToken);
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setFormData({ name: '', color: '#3B82F6' });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  // Deletar categoria
  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    try {
      await deleteCategory(accessToken, id, refreshAccessToken);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  // Iniciar edição
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, color: category.color });
    setIsCreating(false);
  };

  // Cancelar edição/criação
  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', color: '#3B82F6' });
  };

  return (
    <AppShell maxWidth="max-w-md" className="pb-24">
      <div className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Categorias</h1>
        </div>

        {/* Botão criar */}
        {!isCreating && !editingId && (
          <Button
            onClick={() => {
              setIsCreating(true);
              setFormData({ name: '', color: '#3B82F6' });
            }}
            className="w-full bg-blue-primary text-white hover:bg-blue-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        )}

        {/* Form criar/editar */}
        <AnimatePresence>
          {(isCreating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard padding="md" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {isCreating ? 'Nova Categoria' : 'Editar Categoria'}
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  placeholder="Nome da categoria"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={50}
                />

                <div>
                  <label className="text-xs font-medium text-text-secondary/70 dark:text-text-secondary-dark/70 mb-2 block">
                    Cor
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex gap-2 flex-wrap">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === color
                              ? 'border-blue-primary scale-110'
                              : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    className="flex-1"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => (isCreating ? handleCreate() : editingId && handleUpdate(editingId))}
                    className="flex-1 bg-blue-primary text-white hover:bg-blue-primary/90"
                    size="sm"
                    disabled={!formData.name.trim()}
                  >
                    {isCreating ? 'Criar' : 'Salvar'}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de categorias */}
        {isLoading ? (
          <div className="text-center py-8 text-text-secondary/60 dark:text-text-secondary-dark/60">
            Carregando...
          </div>
        ) : categories.length === 0 ? (
          <GlassCard padding="md" className="text-center py-8">
            <p className="text-sm text-text-secondary/60 dark:text-text-secondary-dark/60">
              Nenhuma categoria criada ainda.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard padding="md" className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-text-secondary/60 hover:text-text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

