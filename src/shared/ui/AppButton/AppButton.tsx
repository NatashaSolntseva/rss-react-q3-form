interface AppButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  className?: string;
}

export const AppButton = ({
  onClick,
  text,
  disabled = false,
  className = '',
}: AppButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {text}
    </button>
  );
};
