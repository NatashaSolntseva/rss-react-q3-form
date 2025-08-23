import { useState } from 'react';
import { COUNTRIES } from '@/shared/constants/countries';
import type { UseFormRegisterReturn } from 'react-hook-form';

type AutocompleteInputProps = {
  label?: string;

  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;

  register?: UseFormRegisterReturn;
  watchValue?: string;
  setCountryValue?: (
    value: string,
    options?: {
      shouldValidate?: boolean;
      shouldDirty?: boolean;
      shouldTouch?: boolean;
    }
  ) => void;
  errorMessage?: string | null;
};

export const AutocompleteInput = ({
  label = 'Country',
  value,
  onChange,
  error,
  register,
  watchValue,
  setCountryValue,
  errorMessage,
}: AutocompleteInputProps) => {
  const [showCountries, setShowCountries] = useState(false);

  const currentValue = register ? (watchValue ?? '') : (value ?? '');

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(currentValue.toLowerCase().trim())
  ).slice(0, 10);

  return (
    <div className="relative">
      <label htmlFor="country" className="mb-1 block text-sm text-white/80">
        {label}
      </label>

      <input
        id="country"
        type="text"
        placeholder="Start typing…"
        {...(register
          ? {
              ...register,
              onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
                const val = e.currentTarget.value;
                setShowCountries(!!val);
              },
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                register.onChange(e);
                setShowCountries(true);
              },
            }
          : {
              value: value ?? '',
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
                setShowCountries(true);
              },
              onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
                const val = e.currentTarget.value;
                setShowCountries(!!val);
              },
              onBlur: () => {
                setTimeout(() => setShowCountries(false), 120);
              },
              'aria-invalid': !!error,
            })}
        autoComplete="off"
        className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
      />

      {showCountries && currentValue.trim().length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/15 bg-slate-900/95 p-1 shadow-xl backdrop-blur scrollbar-thin">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <li
                key={c}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (setCountryValue) {
                    setCountryValue(c, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  } else {
                    onChange?.(c);
                  }
                  setShowCountries(false);
                }}
              >
                {c}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-white/60">No matches</li>
          )}
        </ul>
      )}

      <div className="mt-1 min-h-[20px] text-sm">
        {(errorMessage || error) && (
          <p className="text-red-400">{errorMessage ?? error}</p>
        )}
      </div>
    </div>
  );
};
