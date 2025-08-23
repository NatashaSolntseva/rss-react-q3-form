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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formEl = e.currentTarget;

    const formData = new FormData(formEl);
    const name = formData.get('name')?.toString().trim() ?? '';
    const ageRaw = formData.get('age')?.toString().trim() ?? '';
    const email = formData.get('email')?.toString().trim() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';
    const gender = (formData.get('gender')?.toString() ?? 'other') as
      | 'female'
      | 'male'
      | 'other';
    const accepted = formData.get('acceptTerms') === 'on';
    const file = pictureRef.current?.files?.[0];
    const age = Number(ageRaw);

    let hasError = false;

    // name
    if (!name) {
      setNameError('Please enter your name');
      nameRef.current?.focus();
      hasError = true;
    } else if (!/^[A-Z].*/.test(name)) {
      setNameError('Name should start with a capital letter');
      nameRef.current?.focus();
      hasError = true;
    } else setNameError(null);

    // age
    if (!ageRaw) {
      console.log(ageRaw);
      setAgeError('Please enter your age');
      if (!hasError) ageRef.current?.focus();
      hasError = true;
    } else if (isNaN(Number(ageRaw))) {
      setAgeError('Age should be a number');
      if (!hasError) ageRef.current?.focus();
      hasError = true;
    } else if (age < 1 || age > 120) {
      setAgeError('Age must be between 1 and 120');
      if (!hasError) ageRef.current?.focus();
      hasError = true;
    } else {
      setAgeError(null);
    }

    // email
    if (!email) {
      setEmailError('Please enter your email');
      if (!hasError) emailRef.current?.focus();
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      if (!hasError) emailRef.current?.focus();
      hasError = true;
    } else setEmailError(null);

    // password
    if (!password) {
      setPasswordError('Please enter your password');
      if (!hasError) passwordRef.current?.focus();
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      if (!hasError) passwordRef.current?.focus();
      hasError = true;
    } else setPasswordError(null);

    // confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      if (!hasError) confirmPasswordRef.current?.focus();
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      if (!hasError) confirmPasswordRef.current?.focus();
      hasError = true;
    } else setConfirmPasswordError(null);

    // gender
    if (!gender) {
      setGenderError('Please select your gender');
      if (!hasError) genderFirstRef.current?.focus();
      hasError = true;
    } else setGenderError(null);

    // country
    if (!country.trim()) {
      setCountryError('Please choose your country');
      if (!hasError) countryInputRef.current?.focus();
      hasError = true;
    } else setCountryError(null);

    // terms
    if (!accepted) {
      setTermsError('Please accept the Terms & Conditions to continue');
      if (!hasError) termsRef.current?.focus();
      hasError = true;
    } else setTermsError(null);

    // picture
    const validatePicture = (file?: File | null) => {
      if (!file) return { ok: false, msg: 'Please upload a picture' };
      if (file.size > 2 * 1024 * 1024)
        return { ok: false, msg: 'File size should be less than 2MB' };
      if (!['image/png', 'image/jpeg'].includes(file.type))
        return { ok: false, msg: 'Only PNG or JPEG allowed' };
      return { ok: true as const, msg: null as null };
    };

    const picCheck = validatePicture(file);
    if (!picCheck.ok) {
      setPictureError(picCheck.msg);
      if (!hasError) pictureRef.current?.focus();
      hasError = true;
    } else {
      setPictureError(null);
    }

    if (hasError) return;

    let pictureBase64: string | undefined;
    if (file) {
      try {
        pictureBase64 = await fileToBase64(file);
      } catch {
        setPictureError('Failed to read the image, please try another file');
        pictureRef.current?.focus();
        return;
      }
    }

    dispatch(
      addEntry({
        id: crypto.randomUUID(),
        name,
        age,
        email,
        gender,
        country,
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
