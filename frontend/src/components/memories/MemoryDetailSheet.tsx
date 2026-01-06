/**
 * Sheet de detalhes de memória - Experiência Editorial Premium
 * Layout calmo, leitura confortável, composer elegante
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CategorySelect } from './CategorySelect';
import { GlassCard } from '../ui/GlassCard';
import { ObservationItem } from './ObservationItem';
import { useMemoryMetadata } from '@/hooks/useMemoryMetadata';
import type { ExtendedMemoryEntry } from '../MemoryTimeline';

interface MemoryDetailSheetProps {
  memory: ExtendedMemoryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (memoryId: string, updates: Partial<{ category?: string; title?: string; body?: string }>) => void;
}

function getContent(interpretation: ExtendedMemoryEntry['interpretation']) {
  if (!interpretation) {
    return { title: 'Registro', body: undefined };
  }
  if (interpretation.task) {
    return {
      title: interpretation.task.title,
      body: interpretation.task.description,
    };
  }
  if (interpretation.note) {
    return {
      title: interpretation.note.title || interpretation.note.content,
      body: interpretation.note.title ? interpretation.note.content : undefined,
    };
  }
  if (interpretation.reminder) {
    return {
      title: interpretation.reminder.title,
      body: interpretation.reminder.description,
    };
  }
  return {
    title: 'Registro',
    body: undefined,
  };
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MemoryDetailSheet({ memory, open, onOpenChange, onUpdate }: MemoryDetailSheetProps) {
  const { getMetadata, updateMetadata, addObservation } = useMemoryMetadata();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [newObservation, setNewObservation] = useState('');
  const [showOriginalText, setShowOriginalText] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const metadata = memory ? getMetadata(memory.id) : undefined;
  const observations = metadata?.observations || [];
  const category = metadata?.category;

  // Inicializar valores de edição quando a memória muda
  useEffect(() => {
    if (memory) {
      const content = getContent(memory.interpretation);
      setEditTitle(content.title || '');
      setEditBody(content.body || '');
      setEditCategory(category || '');
      setIsEditMode(false);
      setNewObservation('');
    }
  }, [memory, category]);

  if (!memory) {
    return null;
  }

  const content = getContent(memory.interpretation);

  const handleSave = () => {
    onUpdate(memory.id, {
      title: editTitle,
      body: editBody,
      category: editCategory || undefined,
    });
    updateMetadata(memory.id, { category: editCategory || undefined });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    const content = getContent(memory.interpretation);
    setEditTitle(content.title || '');
    setEditBody(content.body || '');
    setEditCategory(category || '');
    setIsEditMode(false);
  };

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      addObservation(memory.id, newObservation.trim());
      setNewObservation('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Auto-grow textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewObservation(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  };

  // Get original text from memory content
  const originalText = memory.content;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] max-h-[90vh] rounded-t-3xl overflow-hidden bg-white dark:bg-slate-950 p-0 data-[state=open]:backdrop-blur-sm flex flex-col"
      >
        {/* Header discreto */}
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/10 dark:border-border-dark/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left text-sm text-text-secondary/60 dark:text-text-secondary-dark/60 font-normal">
              Memória
            </SheetTitle>
            <div className="flex items-center gap-2">
              {!isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditMode(true)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Conteúdo editorial centralizado */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[880px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {isEditMode ? (
            // Modo de edição compacto
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 py-8"
            >
              <div className="space-y-3">
                <label className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                  Título
                </label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título da memória"
                  className="text-lg"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                  Descrição
                </label>
                <Textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  placeholder="Descrição da memória"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                  Categoria
                </label>
                <CategorySelect
                  value={editCategory}
                  onValueChange={setEditCategory}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-blue-primary text-white hover:bg-blue-primary/90"
                  size="sm"
                >
                  Salvar
                </Button>
              </div>
            </motion.div>
          ) : (
            // Modo de visualização editorial
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="py-8"
            >
              {/* Título grande + metadados em linha */}
              <div className="mb-12">
                <motion.h2 
                  className="text-5xl font-medium text-text-primary dark:text-text-primary-dark leading-[1.1] mb-6" 
                  style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {content.title}
                </motion.h2>
                
                {/* Metadados em linha discreta */}
                <motion.div 
                  className="flex items-center gap-3 text-xs text-text-secondary/40 dark:text-text-secondary-dark/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                >
                  {category && (
                    <>
                      <span className="font-medium">{category}</span>
                      <span className="opacity-30">•</span>
                    </>
                  )}
                  <span>{formatDateTime(memory.timestamp)}</span>
                </motion.div>
              </div>

              {/* Body - parágrafo leve */}
              {content.body && (
                <motion.p 
                  className="text-xl leading-[1.8] text-text-secondary/80 dark:text-text-secondary-dark/80 mb-12" 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {content.body}
                </motion.p>
              )}

              {/* Entrada original colapsável */}
              {originalText && originalText.trim() && originalText !== content.title && originalText !== content.body && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mb-12"
                >
                  <GlassCard padding="md" className="text-left">
                    <button
                      onClick={() => setShowOriginalText(!showOriginalText)}
                      className="w-full flex items-center justify-between text-xs text-text-secondary/50 dark:text-text-secondary-dark/50 hover:text-text-secondary/70 dark:hover:text-text-secondary-dark/70 transition-colors py-1"
                    >
                      <span style={{ fontWeight: 400, letterSpacing: '0.01em' }}>Entrada original</span>
                      <motion.div
                        animate={{ rotate: showOriginalText ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" strokeWidth={2} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {showOriginalText && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 pt-4 border-t border-border/10 dark:border-border-dark/10 text-sm text-text-secondary/60 dark:text-text-secondary-dark/60 break-words leading-relaxed whitespace-pre-wrap">
                            {originalText}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              )}

              {/* Seção de Observações */}
              <motion.div 
                className="pt-12 border-t border-border/5 dark:border-border-dark/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.22 }}
              >
                <h3 className="text-xs font-medium text-text-primary/50 dark:text-text-primary-dark/50 mb-8 uppercase tracking-widest" style={{ fontWeight: 500, letterSpacing: '0.1em' }}>
                  Observações
                </h3>

                {/* Lista de observações como camadas */}
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {observations.map((observation, index) => (
                      <ObservationItem
                        key={observation.id}
                        text={observation.text}
                        timestamp={observation.createdAt}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Estado vazio aconchegante */}
                  {observations.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center py-16"
                    >
                      <p className="text-sm text-text-secondary/35 dark:text-text-secondary-dark/35 italic" style={{ letterSpacing: '0.01em' }}>
                        Nenhuma observação ainda.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
          </div>
        </div>

        {/* Composer fixo no rodapé (dock) - apenas em view mode */}
        {!isEditMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 border-t border-border/5 dark:border-border-dark/5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg px-6 sm:px-8 py-5"
          >
            <div className="max-w-[880px] mx-auto flex items-end gap-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={newObservation}
                  onChange={handleTextareaChange}
                  placeholder="Adicionar observação..."
                  className="min-h-[48px] max-h-[96px] resize-none text-base py-3.5 px-4 leading-relaxed"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleAddObservation();
                    }
                  }}
                />
              </div>
              <motion.div
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  onClick={handleAddObservation}
                  disabled={!newObservation.trim()}
                  className="h-[48px] px-5 bg-blue-primary text-white hover:bg-blue-primary/90 disabled:opacity-30 transition-opacity"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} />
                  <span className="text-sm font-medium">Adicionar</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}

