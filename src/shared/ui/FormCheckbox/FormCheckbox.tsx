import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type BaseProps = {
  id: string;
  label: string;
  error?: string | null;
  className?: string;
};

type RHFMode = {
  register: UseFormRegisterReturn;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'children'>;

type RawMode = {
  register?: undefined;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'>;

type TermsCheckboxProps = BaseProps & (RHFMode | RawMode);

export const FormCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  ({ id, label, error, className, register, ...rest }, ref) => {
    const inputCls =
      'h-4 w-4 rounded border-white/30 bg-white/10 accent-fuchsia-500';
    const wrapperCls = `flex items-center gap-2 ${className || ''}`;

    return (
      <div>
        <div className={wrapperCls}>
          <input
            id={id}
            type="checkbox"
            aria-invalid={!!error}
            {...(register ? register : {})}
            {...(!register ? { ref, ...rest } : {})}
            className={inputCls}
          />
          <label htmlFor={id} className="text-sm text-white/80">
            {label}
          </label>
        </div>

        <div className="mt-1 min-h-[20px] text-sm">
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
