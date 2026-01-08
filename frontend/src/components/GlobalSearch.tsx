/**
 * Global Search - Command Palette (Ctrl+K / ⌘K)
 * Busca global de memórias com filtros rápidos
 */
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './ui/command';
import { searchMemories, type SearchResult } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, FileText, Bell, Calendar } from 'lucide-react';
import type { MemoryEntry } from './MemoryTimeline';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMemory: (memory: MemoryEntry) => void;
}

type FilterType = 'all' | 'task' | 'note' | 'reminder';
type FilterTime = 'all' | 'today' | 'week' | 'month';

export function GlobalSearch({ open, onOpenChange, onSelectMemory }: GlobalSearchProps) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [timeFilter, setTimeFilter] = useState<FilterTime>('all');

  // Debounce da busca
  const debouncedQuery = useDebounce(query, 250);

  // Calcular filtros de data
  const getDateFilters = useCallback((): { from?: string; to?: string } => {
    const now = new Date();
    switch (timeFilter) {
      case 'today': {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return { from: today.toISOString() };
      }
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { from: weekAgo.toISOString() };
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { from: monthAgo.toISOString() };
      }
      default:
        return {};
    }
  }, [timeFilter]);

  // Buscar memórias
  useEffect(() => {
    if (!open || !accessToken || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const dateFilters = getDateFilters();
        const searchResults = await searchMemories(
          accessToken,
          debouncedQuery,
          {
            types: typeFilter === 'all' ? undefined : [typeFilter],
            ...dateFilters,
          },
          async () => {
            await refreshAccessToken();
            return localStorage.getItem('lumeo_access_token') || '';
          },
        );
        setResults(searchResults);
      } catch (error) {
        console.error('Erro ao buscar memórias:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, typeFilter, timeFilter, open, accessToken, getDateFilters, refreshAccessToken]);

  // Converter SearchResult para MemoryEntry
  const convertToMemoryEntry = useCallback((result: SearchResult): MemoryEntry => {
    const interpretation = {
      needs_confirmation: false,
      action_type: result.type,
      ...(result.type === 'task' && {
        task: {
          title: result.title,
          description: result.snippet,
        },
      }),
      ...(result.type === 'note' && {
        note: {
          title: result.title,
          content: result.snippet,
        },
      }),
      ...(result.type === 'reminder' && {
        reminder: {
          title: result.title,
          description: result.snippet,
          reminder_date: result.when || new Date().toISOString(),
        },
      }),
    };

    return {
      id: result.id,
      type: 'assistant',
      interpretation: interpretation as any,
      timestamp: new Date(result.createdAt),
      metadata: result.category ? { category: result.category } : undefined,
    };
  }, []);

  // Handler de seleção
  const handleSelect = useCallback(
    (result: SearchResult) => {
      const memory = convertToMemoryEntry(result);
      onSelectMemory(memory);
      onOpenChange(false);
      setQuery('');
    },
    [convertToMemoryEntry, onSelectMemory, onOpenChange],
  );

  // Handler de tecla Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Ícone por tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return ClipboardList;
      case 'note':
        return FileText;
      case 'reminder':
        return Bell;
      default:
        return FileText;
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Buscar memórias..."
        value={query}
        onValueChange={setQuery}
      />
      
      {/* Filtros rápidos */}
      <div className="border-b px-3 py-2 flex items-center gap-2 flex-wrap">
        {/* Filtros de tipo */}
        <div className="flex items-center gap-1">
          {(['all', 'task', 'note', 'reminder'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                typeFilter === type
                  ? 'bg-blue-primary/10 text-blue-primary'
                  : 'text-text-secondary/60 hover:text-text-primary hover:bg-background/50'
              }`}
            >
              {type === 'all' ? 'Todos' : type === 'task' ? 'Tarefas' : type === 'note' ? 'Notas' : 'Lembretes'}
            </button>
          ))}
        </div>

        {/* Filtros de tempo */}
        <div className="flex items-center gap-1 ml-auto">
          {(['all', 'today', 'week', 'month'] as FilterTime[]).map((time) => (
            <button
              key={time}
              onClick={() => setTimeFilter(time)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                timeFilter === time
                  ? 'bg-blue-primary/10 text-blue-primary'
                  : 'text-text-secondary/60 hover:text-text-primary hover:bg-background/50'
              }`}
            >
              {time === 'all' ? 'Tudo' : time === 'today' ? 'Hoje' : time === 'week' ? '7 dias' : '30 dias'}
            </button>
          ))}
        </div>
      </div>

      <CommandList>
        {isLoading && (
          <div className="py-6 text-center text-sm text-text-secondary/60">
            Buscando...
          </div>
        )}

        {!isLoading && results.length === 0 && debouncedQuery.length >= 2 && (
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        )}

        {!isLoading && debouncedQuery.length < 2 && (
          <CommandEmpty>Digite pelo menos 2 caracteres para buscar.</CommandEmpty>
        )}

        {!isLoading && results.length > 0 && (
          <CommandGroup heading="Resultados">
            {results.map((result) => {
              const Icon = getTypeIcon(result.type);
              return (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                >
                  <Icon className="w-4 h-4 mt-0.5 text-text-secondary/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      {result.title}
                    </div>
                    <div className="text-sm text-text-secondary/60 dark:text-text-secondary-dark/60 line-clamp-1">
                      {result.snippet}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary/40 dark:text-text-secondary-dark/40">
                      <span>{formatDate(result.createdAt)}</span>
                      {result.when && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(result.when)}
                          </span>
                        </>
                      )}
                      {result.category && (
                        <>
                          <span>•</span>
                          <span 
                            className="flex items-center gap-1"
                            style={{ color: result.category.color }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: result.category.color }}
                            />
                            {result.category.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

