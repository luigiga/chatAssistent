/**
 * Hook para gerenciar metadados de memórias
 * Armazena em localStorage para persistência local
 */
import { useState, useCallback, useEffect } from 'react';
import type { MemoryMetadata, MemoryCategory } from '../components/MemoryTimeline';

const STORAGE_KEY = 'lumeo_memory_metadata';
const CATEGORIES_KEY = 'lumeo_categories';

const DEFAULT_CATEGORIES: MemoryCategory[] = ['Pessoal', 'Trabalho', 'Saúde', 'Finanças', 'Ideias', 'Rotina'];

interface StoredMetadata {
  [memoryId: string]: MemoryMetadata;
}

export function useMemoryMetadata() {
  const [metadataMap, setMetadataMap] = useState<StoredMetadata>({});
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMetadataMap(JSON.parse(stored));
      }

      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) {
        const parsed = JSON.parse(storedCategories);
        // Garantir que categorias padrão sempre existam
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...parsed])];
        setCategories(allCategories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Erro ao carregar metadados:', error);
    }
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadataMap));
    } catch (error) {
      console.error('Erro ao salvar metadados:', error);
    }
  }, [metadataMap]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  }, [categories]);

  const getMetadata = useCallback(
    (memoryId: string): MemoryMetadata | undefined => {
      return metadataMap[memoryId];
    },
    [metadataMap],
  );

  const updateMetadata = useCallback(
    (memoryId: string, updates: Partial<MemoryMetadata>) => {
      setMetadataMap((prev) => {
        const current = prev[memoryId] || {};
        return {
          ...prev,
          [memoryId]: {
            ...current,
            ...updates,
          },
        };
      });
    },
    [],
  );

  const addObservation = useCallback(
    (memoryId: string, text: string) => {
      const observation = {
        id: `obs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        createdAt: new Date(),
      };

      setMetadataMap((prev) => {
        const current = prev[memoryId] || {};
        const existingObservations = current.observations || [];
        return {
          ...prev,
          [memoryId]: {
            ...current,
            observations: [observation, ...existingObservations], // Mais recente primeiro
          },
        };
      });
    },
    [],
  );

  const getCategories = useCallback((): string[] => {
    return categories;
  }, [categories]);

  const addCategory = useCallback(
    (category: string) => {
      if (!categories.includes(category)) {
        setCategories((prev) => [...prev, category]);
      }
    },
    [categories],
  );

  return {
    getMetadata,
    updateMetadata,
    addObservation,
    getCategories,
    addCategory,
  };
}


