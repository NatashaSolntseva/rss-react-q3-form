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
      className={`cursor-pointer rounded-xl bg-gradient-to-r from-indigo-500/80 to-fuchsia-500/80 
                  px-5 py-2 font-semibold text-white shadow-md backdrop-blur-sm 
                  transition-all duration-200 hover:from-indigo-500 hover:to-fuchsia-500 
                  hover:shadow-lg active:scale-95 
                  disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {text}
    </button>
  );
};
