import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type BaseProps = {
  id?: string;
  label?: string;
  accept?: string;
  className?: string;
  showSelectedName?: boolean;
};

type RhfMode = {
  mode: 'rhf';
  register: UseFormRegisterReturn;
  errorMessage?: string | null;
};

type RawMode = {
  mode: 'raw';
  name: string;
  onChange?: (files: FileList | null) => void;
  error?: string | null;
};

type Props = BaseProps & (RhfMode | RawMode);

export const FileInput = ({
  id = 'picture',
  label = 'Upload your picture',
  accept = 'image/png, image/jpeg',
  className,
  showSelectedName = true,
  ...modeProps
}: Props) => {
  const [selected, setSelected] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelected(files && files[0] ? files[0].name : '');

    if (modeProps.mode === 'rhf') {
      modeProps.register.onChange(e);
    } else {
      modeProps.onChange?.(files);
    }
  };

  const errorText =
    modeProps.mode === 'rhf'
      ? (modeProps.errorMessage ?? null)
      : (modeProps.error ?? null);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm text-white/80">
        {label}
      </label>

      {modeProps.mode === 'rhf' ? (
        <input
          id={id}
          type="file"
          accept={accept}
          className="w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white file:hover:bg-white/20"
          {...modeProps.register}
          onChange={handleChange}
          aria-invalid={!!errorText}
        />
      ) : (
        <input
          id={id}
          name={modeProps.name}
          type="file"
          accept={accept}
          className="w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white file:hover:bg-white/20"
          onChange={handleChange}
          aria-invalid={!!errorText}
        />
      )}

      {showSelectedName && (
        <div className="mt-1 text-xs text-white/60">
          {selected ? `Selected: ${selected}` : 'Browse… No file selected.'}
        </div>
      )}

      <div className="mt-1 min-h-[20px] text-sm">
        {errorText && <p className="text-red-400">{errorText}</p>}
      </div>
    </div>
  );
};
