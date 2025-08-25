import { useDispatch } from 'react-redux';
import { useState, type FormEvent, useRef } from 'react';

import { addEntry } from '../model/formsSlice';

import {
  AppButton,
  FormCheckbox,
  FormInput,
  RadioGroup,
  AutocompleteInput,
  FileInput,
  PasswordInput,
} from '@/shared/ui';
import { passwordChecks, fileToBase64 } from '@/shared/utils';
import { schema, type TFormFieldsValues } from '../model/controlledFormSchema';
import { ValidationError } from 'yup';

type UncontrolledFormProps = { onSuccess?: () => void };

export const UncontrolledForm = ({ onSuccess }: UncontrolledFormProps) => {
  const dispatch = useDispatch();

  const [nameError, setNameError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [pictureError, setPictureError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const genderFirstRef = useRef<HTMLInputElement | null>(null);
  const countryInputRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const pictureRef = useRef<HTMLInputElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);

  const [country, setCountry] = useState('');

  const [strength, setStrength] = useState({
    number: false,
    upper: false,
    lower: false,
    special: false,
  });

  const handlePasswordChange = (val: string) => {
    setStrength({
      number: passwordChecks.number.test(val),
      upper: passwordChecks.upper.test(val),
      lower: passwordChecks.lower.test(val),
      special: passwordChecks.special.test(val),
    });
  };

  const focusOrder = [
    { key: 'name' as const, ref: () => nameRef.current },
    { key: 'age' as const, ref: () => ageRef.current },
    { key: 'email' as const, ref: () => emailRef.current },
    { key: 'gender' as const, ref: () => genderFirstRef.current },
    { key: 'country' as const, ref: () => countryInputRef.current },
    { key: 'password' as const, ref: () => passwordRef.current },
    { key: 'confirmPassword' as const, ref: () => confirmPasswordRef.current },
    { key: 'picture' as const, ref: () => pictureRef.current },
    { key: 'acceptTerms' as const, ref: () => termsRef.current },
  ];

  const clearAllErrors = () => {
    setNameError(null);
    setAgeError(null);
    setEmailError(null);
    setGenderError(null);
    setCountryError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setPictureError(null);
    setTermsError(null);
  };

  const applyErrors = (
    errs: Partial<Record<keyof TFormFieldsValues, string>>
  ) => {
    setNameError(errs.name ?? null);
    setAgeError(errs.age ?? null);
    setEmailError(errs.email ?? null);
    setGenderError(errs.gender ?? null);
    setCountryError(errs.country ?? null);
    setPasswordError(errs.password ?? null);
    setConfirmPasswordError(errs.confirmPassword ?? null);
    setPictureError(errs.picture ?? null);
    setTermsError(errs.acceptTerms ?? null);

    const firstBad = focusOrder.find(({ key }) => errs[key]);
    firstBad?.ref()?.focus?.();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const name = (formData.get('name') ?? '').toString().trim();
    const ageRaw = (formData.get('age') ?? '').toString().trim();
    const email = (formData.get('email') ?? '').toString().trim();
    const password = (formData.get('password') ?? '').toString();
    const confirmPassword = (formData.get('confirmPassword') ?? '').toString();
    const gender = (formData.get('gender') ??
      'other') as TFormFieldsValues['gender'];
    const acceptTerms = formData.get('acceptTerms') === 'on';
    const picture = pictureRef.current
      ?.files as unknown as TFormFieldsValues['picture'];
    const countryVal = country;

    const candidate: Partial<TFormFieldsValues> = {
      name,
      age: ageRaw as unknown as number,
      email,
      gender,
      country: countryVal,
      password,
      confirmPassword,
      acceptTerms,
      picture,
    };

    try {
      await schema.validate(candidate, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const map: Partial<Record<keyof TFormFieldsValues, string>> = {};
        for (const issue of err.inner) {
          const path = issue.path as keyof TFormFieldsValues | undefined;
          if (path && !map[path]) map[path] = issue.message;
        }
        applyErrors(map);
        return;
      }

      applyErrors({});
      return;
    }

    const f = pictureRef.current?.files?.[0];

    let pictureBase64: string | undefined;
    if (f) {
      try {
        pictureBase64 = await fileToBase64(f);
      } catch {
        applyErrors({
          picture: 'Failed to read the image, please try another file',
        });
        return;
      }
    }

    dispatch(
      addEntry({
        id: crypto.randomUUID(),
        name,
        age: Number(ageRaw),
        email,
        gender,
        country: countryVal,
        pictureBase64,
        createdAt: Date.now(),
        source: 'uncontrolled',
      })
    );

    formEl.reset();
    setCountry('');
    setStrength({ number: false, upper: false, lower: false, special: false });
    onSuccess?.();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-1 text-white" noValidate>
      <FormInput
        id="name"
        label="Name"
        name="name"
        placeholder="John"
        ref={nameRef}
        error={nameError}
      />
      <FormInput
        id="age"
        type="text"
        label="Age"
        name="age"
        placeholder="25"
        ref={ageRef}
        error={ageError}
      />
      <FormInput
        id="email"
        type="email"
        label="Email"
        name="email"
        placeholder="john@example.com"
        ref={emailRef}
        error={emailError}
      />
      <RadioGroup
        idBase="gender"
        label="Gender"
        name="gender"
        defaultValue="other"
        firstRef={genderFirstRef}
        error={genderError}
      />
      <AutocompleteInput
        value={country}
        onChange={setCountry}
        error={countryError}
      />
      <PasswordInput
        id="password"
        label="Password"
        mode="raw"
        name="password"
        inputRef={passwordRef}
        onChange={handlePasswordChange}
        error={passwordError}
        showStrength
        strength={strength}
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirm password"
        mode="raw"
        name="confirmPassword"
        inputRef={confirmPasswordRef}
        error={confirmPasswordError}
      />
      <FileInput
        mode="raw"
        name="picture"
        inputRef={pictureRef}
        error={pictureError}
      />
      <FormCheckbox
        id="acceptTerms"
        name="acceptTerms"
        label="I accept the Terms & Conditions"
        error={termsError}
        ref={termsRef}
      />

      <div className="pt-1">
        <AppButton type="submit" text="Submit" />
      </div>
    </form>
  );
};
