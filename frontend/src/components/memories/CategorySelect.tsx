/**
 * Componente reutilizável para seleção de categoria
 * Permite selecionar categorias existentes do backend
 */
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { listCategories, type Category } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface CategorySelectProps {
  value?: string; // categoryId
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CategorySelect({ value, onValueChange, placeholder = 'Selecionar categoria...' }: CategorySelectProps) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;
      setIsLoading(true);
      try {
        const data = await listCategories(accessToken, refreshAccessToken);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [accessToken, refreshAccessToken]);

  const handleSelectChange = (selectedValue: string) => {
    onValueChange(selectedValue === 'none' ? '' : selectedValue);
  };

  return (
    <Select value={value || 'none'} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? 'Carregando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sem categoria</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

