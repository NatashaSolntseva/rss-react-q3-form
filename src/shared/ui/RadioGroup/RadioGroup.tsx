import { forwardRef } from 'react';
import type { Ref } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type Gender = 'female' | 'male' | 'other';

type Option = { value: Gender; label: string };

type BaseProps = {
  idBase: string;
  label?: string;
  error?: string | null;
  options?: Option[];
  className?: string;
};

type RHFMode = {
  register: UseFormRegisterReturn;
  name?: never;
  defaultValue?: never;
  firstRef?: never;
};

type RawMode = {
  register?: never;
  name: string;
  defaultValue?: Gender;
  firstRef?: Ref<HTMLInputElement>;
};

type Props = BaseProps & (RHFMode | RawMode);

export const RadioGroup = forwardRef<HTMLInputElement, Props>(
  ({
    idBase,
    label = 'Gender',
    error,
    options = [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'other', label: 'Other' },
    ],
    className,
    register,
    name,
    defaultValue = 'other',
    firstRef,
  }) => {
    const groupLabelId = `${idBase}-label`;

    return (
      <div role="group" aria-labelledby={groupLabelId} className={className}>
        <span id={groupLabelId} className="mb-1 block text-sm text-white/80">
          {label}
        </span>

        <div className="flex flex-wrap gap-4">
          {options.map((opt, idx) => {
            const radioId = `${idBase}-${opt.value}`;
            const commonProps = {
              id: radioId,
              type: 'radio' as const,
              value: opt.value,
              className: 'h-4 w-4 accent-fuchsia-500',
              'aria-invalid': !!error,
            };

            return (
              <label
                key={opt.value}
                htmlFor={radioId}
                className="flex items-center gap-2 text-white/85"
              >
                {register ? (
                  <input {...commonProps} {...register} />
                ) : (
                  <input
                    {...commonProps}
                    name={name}
                    defaultChecked={defaultValue === opt.value}
                    ref={
                      idx === 0
                        ? (firstRef as Ref<HTMLInputElement>)
                        : undefined
                    }
                  />
                )}
                {opt.label}
              </label>
            );
          })}
        </div>

        <div className="mt-1 min-h-[20px] text-sm">
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'GenderRadioGroup';
