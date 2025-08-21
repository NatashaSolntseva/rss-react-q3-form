import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { schema, type TFormFieldsValues } from '../model/controlledFormSchema';
import { addEntry } from '../model/formsSlice';
import { passwordChecks } from '@/shared/utils/passwordCheck';
import { fileToBase64 } from '@/shared/utils/fileToBase64';

import { AppButton, FormCheckbox, FormInput, RadioGroup } from '@/shared/ui';

import { COUNTRIES } from '@/shared/constants/countries';

type ControlledFormProps = {
  onSuccess?: () => void;
};

export const ControlledForm = ({ onSuccess }: ControlledFormProps) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<TFormFieldsValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: 'other',
      acceptTerms: false,
      picture: undefined,
      password: '',
      country: '',
    },
  });

  const pwd = watch('password') ?? '';
  const strength = {
    number: passwordChecks.number.test(pwd),
    upper: passwordChecks.upper.test(pwd),
    lower: passwordChecks.lower.test(pwd),
    special: passwordChecks.special.test(pwd),
  };

  const [showCountries, setShowCountries] = useState(false);

  const submit = handleSubmit(async (data) => {
    const base64 = data.picture?.[0]
      ? await fileToBase64(data.picture[0])
      : undefined;

    dispatch(
      addEntry({
        id: crypto.randomUUID(),
        name: data.name,
        age: Number(data.age),
        email: data.email,
        gender: data.gender,
        country: data.country,
        pictureBase64: base64,
        createdAt: Date.now(),
        source: 'rhf',
      })
    );

    reset();
    onSuccess?.();
  });

  return (
    <form onSubmit={submit} className="space-y-1 text-white">
      <FormInput
        id="name"
        label="Name"
        placeholder="John"
        register={register('name')}
        error={errors.name?.message ?? null}
      />
      <FormInput
        id="age"
        type="number"
        label="Age"
        placeholder="18"
        register={register('age')}
        error={errors.age?.message ?? null}
      />
      <FormInput
        id="email"
        type="email"
        label="E-mail"
        placeholder="test@test.com"
        register={register('email')}
        error={errors.email?.message ?? null}
      />
      <RadioGroup
        idBase="gender"
        label="Gender"
        register={register('gender')}
        error={errors.gender?.message ?? null}
      />

      <div className="relative">
        <label htmlFor="country" className="mb-1 block text-sm text-white/80">
          Country
        </label>

        <input
          id="country"
          type="text"
          placeholder="Start typing…"
          {...register('country')}
          autoComplete="off"
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
          onFocus={(e) => {
            const val = (e.target as HTMLInputElement).value;
            setShowCountries(!!val);
          }}
          onChange={(e) => {
            register('country').onChange(e);
            setShowCountries(true);
          }}
        />

        {showCountries && (watch('country') ?? '').trim().length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/15 bg-slate-900/95 p-1 shadow-xl backdrop-blur">
            {COUNTRIES.filter((c) =>
              c
                .toLowerCase()
                .includes((watch('country') ?? '').toLowerCase().trim())
            )
              .slice(0, 10)
              .map((c) => (
                <li
                  key={c}
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue('country', c, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setShowCountries(false);
                  }}
                >
                  {c}
                </li>
              ))}

            {COUNTRIES.filter((c) =>
              c
                .toLowerCase()
                .includes((watch('country') ?? '').toLowerCase().trim())
            ).length === 0 && (
              <li className="px-3 py-2 text-sm text-white/60">No matches</li>
            )}
          </ul>
        )}

        <div className="mt-1 min-h-[20px] text-sm">
          {errors.country && (
            <p className="text-red-400">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-white/80">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15"
        />

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
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm text-white/80"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.confirmPassword && (
            <p className="text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="picture" className="mb-1 block text-sm text-white/80">
          Upload your picture
        </label>
        <input
          id="picture"
          type="file"
          accept="image/png, image/jpeg"
          {...register('picture')}
          className="w-full text-sm text-white/80"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.picture && (
            <p className="text-red-400">{errors.picture.message}</p>
          )}
        </div>
      </div>

      <FormCheckbox
        id="acceptTerms"
        label="I accept the Terms & Conditions"
        error={errors.acceptTerms?.message ?? null}
        register={register('acceptTerms')}
      />

      <div className="pt-4">
        <AppButton
          text="Submit"
          onClick={submit}
          disabled={!isValid || isSubmitting}
        />
      </div>
    </form>
  );
};
