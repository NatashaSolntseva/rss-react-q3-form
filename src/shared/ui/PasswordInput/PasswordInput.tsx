import type { ChangeEvent } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type Strength = {
  number: boolean;
  upper: boolean;
  lower: boolean;
  special: boolean;
};

type BaseProps = {
  id?: string;
  label: string;
  showStrength?: boolean;
  strength?: Strength;
};

type RhfMode = {
  mode: 'rhf';
  register: UseFormRegisterReturn;
  errorMessage?: string | null;
};

type RawMode = {
  mode: 'raw';
  name: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange?: (value: string) => void;
  error?: string | null;
};

type Props = BaseProps & (RhfMode | RawMode);

export const PasswordInput = ({
  id,
  label,
  showStrength = false,
  strength,
  ...modeProps
}: Props) => {
  const errorText =
    modeProps.mode === 'rhf'
      ? (modeProps.errorMessage ?? null)
      : (modeProps.error ?? null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (modeProps.mode === 'rhf') {
      modeProps.register.onChange(e);
    } else {
      modeProps.onChange?.(e.target.value);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-white/80">
        {label}
      </label>

      {modeProps.mode === 'rhf' ? (
        <input
          id={id}
          type="password"
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15"
          {...modeProps.register}
          onChange={handleChange}
          aria-invalid={!!errorText}
        />
      ) : (
        <input
          id={id}
          name={modeProps.name}
          type="password"
          ref={modeProps.inputRef}
          onChange={handleChange}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15"
          aria-invalid={!!errorText}
        />
      )}

      {showStrength && strength && (
        <ul className="mt-2 flex flex-wrap gap-2 text-xs text-white/90">
          <li
            className={`rounded px-2 py-1 ${strength.number ? 'bg-emerald-600/30' : 'bg-white/10'}`}
          >
            1 number
          </li>
          <li
            className={`rounded px-2 py-1 ${strength.upper ? 'bg-emerald-600/30' : 'bg-white/10'}`}
          >
            1 uppercase
          </li>
          <li
            className={`rounded px-2 py-1 ${strength.lower ? 'bg-emerald-600/30' : 'bg-white/10'}`}
          >
            1 lowercase
          </li>
          <li
            className={`rounded px-2 py-1 ${strength.special ? 'bg-emerald-600/30' : 'bg-white/10'}`}
          >
            1 special
          </li>
        </ul>
      )}

      <div className="mt-1 min-h-[20px] text-sm">
        {errorText && <p className="text-red-400">{errorText}</p>}
      </div>
    </div>
  );
};
