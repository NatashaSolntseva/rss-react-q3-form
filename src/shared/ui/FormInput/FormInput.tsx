import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type BaseProps = {
  id: string;
  label: string;
  error?: string | null;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'children'>;

type RHFMode = {
  register: UseFormRegisterReturn;
  name?: never;
  ref?: never;
};

type RawMode = {
  register?: undefined;
  name: string;
};

type Props = BaseProps &
  (RHFMode | RawMode) & {
    type?: 'text' | 'email' | 'number' | 'password';
  };

export const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      type = 'text',
      error,
      className = '',
      register,
      name,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const baseInputCls =
      'w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50';
    const numberNoArrows =
      type === 'number'
        ? 'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
        : '';

    return (
      <div className={className}>
        <label htmlFor={id} className="mb-1 block text-sm text-white/80">
          {label}
        </label>

        {register ? (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`${baseInputCls} ${numberNoArrows}`}
            {...register}
            {...rest}
          />
        ) : (
          <input
            id={id}
            name={name}
            ref={ref}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`${baseInputCls} ${numberNoArrows}`}
            {...rest}
          />
        )}

        <div className="mt-1 min-h-[20px] text-sm">
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
