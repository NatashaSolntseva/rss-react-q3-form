import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { schema, type TFormFieldsValues } from '../model/controlledFormSchema';
import { addEntry } from '../model/formsSlice';
import { passwordChecks } from '@/shared/utils/passwordCheck';
import { fileToBase64 } from '@/shared/utils/fileToBase64';

import {
  AppButton,
  FormCheckbox,
  FormInput,
  RadioGroup,
  AutocompleteInput,
  FileInput,
  PasswordInput,
} from '@/shared/ui';

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
      <AutocompleteInput
        register={register('country')}
        watchValue={watch('country')}
        setCountryValue={(v, opts) => setValue('country', v, opts)}
        errorMessage={errors.country?.message}
      />
      <PasswordInput
        id="password"
        label="Password"
        mode="rhf"
        register={register('password')}
        errorMessage={errors.password?.message}
        showStrength
        strength={strength}
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirm password"
        mode="rhf"
        register={register('confirmPassword')}
        errorMessage={errors.confirmPassword?.message}
      />
      <FileInput
        mode="rhf"
        register={register('picture')}
        errorMessage={errors.picture?.message ?? null}
      />
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
