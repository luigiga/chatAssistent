/**
 * Bottom Sheet para filtros de memórias
 * Permite filtrar por categoria, tipo, observações e ordenação
 */
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useMemoryMetadata } from '@/hooks/useMemoryMetadata';
import type { MemoryFilters } from './types';
import { ClipboardList, FileText, Bell } from 'lucide-react';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: MemoryFilters;
  onFiltersChange: (filters: MemoryFilters) => void;
}

export function FilterSheet({ open, onOpenChange, filters, onFiltersChange }: FilterSheetProps) {
  const { getCategories } = useMemoryMetadata();
  const [localFilters, setLocalFilters] = useState<MemoryFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categories = getCategories();
  const types = [
    { value: 'task' as const, label: 'Tarefa', icon: ClipboardList },
    { value: 'note' as const, label: 'Nota', icon: FileText },
    { value: 'reminder' as const, label: 'Lembrete', icon: Bell },
  ];

  const toggleCategory = (category: string) => {
    const current = localFilters.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setLocalFilters({ ...localFilters, categories: newCategories.length > 0 ? newCategories : undefined });
  };

  const toggleType = (type: 'task' | 'note' | 'reminder') => {
    const current = localFilters.types || [];
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setLocalFilters({ ...localFilters, types: newTypes.length > 0 ? newTypes : undefined });
  };

  const toggleHasObservations = () => {
    setLocalFilters({
      ...localFilters,
      hasObservations: localFilters.hasObservations ? undefined : true,
    });
  };

  const toggleSortBy = () => {
    setLocalFilters({
      ...localFilters,
      sortBy: localFilters.sortBy === 'recent' ? 'oldest' : 'recent',
    });
  };

  const clearFilters = () => {
    const cleared: MemoryFilters = {};
    setLocalFilters(cleared);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const hasActiveFilters = 
    (localFilters.categories && localFilters.categories.length > 0) ||
    (localFilters.types && localFilters.types.length > 0) ||
    localFilters.hasObservations !== undefined ||
    localFilters.sortBy !== undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-left">Filtros</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8 pb-24">
          {/* Categorias */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-text-primary dark:text-text-primary-dark">Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = localFilters.categories?.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipos */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-text-primary dark:text-text-primary-dark">Tipo</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const isSelected = localFilters.types?.includes(type.value);
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Com observações */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-text-primary dark:text-text-primary-dark">Observações</h3>
            <button
              onClick={toggleHasObservations}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                localFilters.hasObservations
                  ? 'bg-blue-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Com observações
            </button>
          </div>

          {/* Ordenar */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-text-primary dark:text-text-primary-dark">Ordenar</h3>
            <button
              onClick={toggleSortBy}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                localFilters.sortBy === 'oldest'
                  ? 'bg-blue-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {localFilters.sortBy === 'oldest' ? 'Mais antigas primeiro' : 'Mais recentes primeiro'}
            </button>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t border-border/20 dark:border-border-dark/20 flex gap-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1"
            >
              Limpar
            </Button>
          )}
          <Button
            onClick={applyFilters}
            className="flex-1 bg-blue-primary text-white hover:bg-blue-primary/90"
          >
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

