/**
 * Componente reutilizável para seleção de categoria
 * Permite selecionar categorias existentes ou criar novas
 */
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMemoryMetadata } from '@/hooks/useMemoryMetadata';

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CategorySelect({ value, onValueChange, placeholder = 'Selecionar categoria...' }: CategorySelectProps) {
  const { getCategories, addCategory } = useMemoryMetadata();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const categories = getCategories();

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === '__create_new__') {
      setIsCreatingNew(true);
    } else {
      onValueChange(selectedValue);
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      onValueChange(newCategoryName.trim());
      setIsCreatingNew(false);
      setNewCategoryName('');
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewCategoryName('');
  };

  if (isCreatingNew) {
    return (
      <div className="space-y-2">
        <Input
          placeholder="Nome da categoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateCategory();
            } else if (e.key === 'Escape') {
              handleCancelCreate();
            }
          }}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreateCategory}
            className="px-3 py-1.5 text-sm bg-blue-primary text-white rounded-md hover:bg-blue-primary/90 transition-colors"
          >
            Criar
          </button>
          <button
            onClick={handleCancelCreate}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Select value={value || ''} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
        <SelectItem value="__create_new__" className="text-blue-primary">
          + Criar nova categoria...
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

