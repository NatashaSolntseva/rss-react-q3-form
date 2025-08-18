import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AppButton } from '@/shared/ui';
import type { Gender } from '../model/types';
import { useState } from 'react';
import { COUNTRIES } from '@/shared/constants/countries';

const passwordChecks = {
  number: /\d/,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  special: /[^A-Za-z0-9]/,
};

export const ControlledForm = () => {
  const schema = yup
    .object({
      name: yup
        .string()
        .required('Please enter your name')
        .matches(/^[A-Z].*$/, 'Name should start with a capital letter'),
      age: yup
        .number()
        .typeError('Age should be a number')
        .required('Please tell us your age')
        .min(0, 'Age cannot be negative'),
      email: yup
        .string()
        .required('Please enter your email')
        .email('That doesn’t look like a valid email'),
      gender: yup.string<Gender>().required('Please select your gender'),

      password: yup
        .string()
        .required('Please create a password')
        .matches(passwordChecks.number, 'Add at least one number')
        .matches(passwordChecks.upper, 'Add at least one uppercase letter')
        .matches(passwordChecks.lower, 'Add at least one lowercase letter')
        .matches(passwordChecks.special, 'Add at least one special character'),
      confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords should match'),

      acceptTerms: yup
        .boolean()
        .required('Please accept the Terms & Conditions to continue')
        .oneOf([true], 'Please accept the Terms & Conditions to continue'),

      picture: yup
        .mixed<FileList>()
        .required()
        .test(
          'fileRequired',
          'Please upload a picture',
          (v) => !!v && v.length > 0
        )
        .test('fileSize', 'File size should be less than 2MB', (v) =>
          !v || !v[0] ? true : v[0].size <= 2 * 1024 * 1024
        )
        .test('fileType', 'Only PNG or JPEG allowed', (v) =>
          !v || !v[0] ? true : ['image/png', 'image/jpeg'].includes(v[0].type)
        ),
      country: yup.string().required('Please choose your country'),
    })
    .required();

  type TFormFieldsValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
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

  const submit = handleSubmit((data) => {
    if (data.picture && data.picture[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        console.log('Base64 image:', base64);
      };
      reader.readAsDataURL(data.picture[0]);
    }
    console.log('RHF submit:', data);
  });

  return (
    <form onSubmit={submit} className="space-y-1 text-white">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-white/80">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John"
          {...register('name')}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-white/80">
          Age
        </label>
        <input
          id="age"
          type="text"
          placeholder="18"
          {...register('age')}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.age && <p className="text-red-400">{errors.age.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-white/80">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          placeholder="test@test.com"
          {...register('email')}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm text-white/80">Gender</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-white/80">
            <input
              type="radio"
              value="female"
              {...register('gender')}
              className="h-4 w-4 accent-fuchsia-500"
            />
            Female
          </label>
          <label className="flex items-center gap-1 text-white/80">
            <input
              type="radio"
              value="male"
              {...register('gender')}
              className="h-4 w-4 accent-fuchsia-500"
            />
            Male
          </label>
          <label className="flex items-center gap-1 text-white/80">
            <input
              type="radio"
              value="other"
              {...register('gender')}
              className="h-4 w-4 accent-fuchsia-500"
            />
            Other
          </label>
        </div>
        <div className="mt-1 min-h-[20px] text-sm">
          {errors.gender && (
            <p className="text-red-400">{errors.gender.message}</p>
          )}
        </div>
      </div>

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

      <div className="flex items-center gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          {...register('acceptTerms')}
          className="h-4 w-4 rounded border-white/30 bg-white/10 accent-fuchsia-500"
        />
        <label htmlFor="acceptTerms" className="text-sm text-white/80">
          I accept the Terms & Conditions
        </label>
      </div>
      <div className="mt-1 min-h-[20px] text-sm">
        {errors.acceptTerms && (
          <p className="text-red-400">{errors.acceptTerms.message}</p>
        )}
      </div>

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
