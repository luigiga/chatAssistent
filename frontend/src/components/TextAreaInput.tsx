/**
 * Componente de input de texto (textarea)
 */
interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TextAreaInput({
  value,
  onChange,
  placeholder = 'Digite sua mensagem aqui...',
  disabled = false,
}: TextAreaInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full min-h-[200px] px-4 py-3 bg-surface border border-border rounded-2xl 
                 text-text-primary placeholder:text-text-secondary
                 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent
                 disabled:opacity-50 disabled:cursor-not-allowed
                 resize-none transition-all duration-200
                 text-base leading-relaxed"
      rows={8}
    />
  );
}

