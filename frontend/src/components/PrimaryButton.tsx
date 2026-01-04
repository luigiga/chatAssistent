/**
 * Botão primário
 */
interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({
  onClick,
  disabled = false,
  loading = false,
  children,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full sm:w-auto px-8 py-3.5 bg-blue-primary text-white font-medium
                 rounded-xl hover:bg-blue-hover active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-primary
                 transition-all duration-200 shadow-sm hover:shadow-md
                 flex items-center justify-center gap-2"
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}

