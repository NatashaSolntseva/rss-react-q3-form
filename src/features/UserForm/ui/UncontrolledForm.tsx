import { useDispatch } from 'react-redux';
import { useState, type FormEvent, useRef } from 'react';

import { addEntry } from '../model/formsSlice';

import { AppButton, FormCheckbox, RadioGroup } from '@/shared/ui';

import { COUNTRIES } from '@/shared/constants/countries';

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
  const [showCountries, setShowCountries] = useState(false);

  const [strength, setStrength] = useState({
    number: false,
    upper: false,
    lower: false,
    special: false,
  });

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(country.toLowerCase().trim())
  ).slice(0, 10);

  const handlePasswordChange = (val: string) => {
    setStrength({
      number: /\d/.test(val),
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      special: /[^A-Za-z0-9]/.test(val),
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
    const file = formData.get('picture') as File | null;
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
      setAgeError('Please enter your age');
      if (!hasError) ageRef.current?.focus();
      hasError = true;
    } else if (isNaN(age) || age < 1 || age > 120) {
      setAgeError('Age must be a number between 1 and 120');
      if (!hasError) ageRef.current?.focus();
      hasError = true;
    } else setAgeError(null);

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
    try {
      pictureBase64 = file
        ? await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        : undefined;
    } catch {
      setPictureError('Failed to read the image, please try another file');
      pictureRef.current?.focus();
      return;
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
    <form onSubmit={handleSubmit} className="space-y-3 text-white" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-white/80">
          Name
        </label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          placeholder="John"
          aria-invalid={!!nameError}
          className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {nameError && <p className="text-red-400">{nameError}</p>}
        </div>
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm text-white/80">
          Age
        </label>
        <input
          ref={ageRef}
          type="number"
          id="age"
          name="age"
          placeholder="25"
          aria-invalid={!!ageError}
          className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50
                     appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                     [-moz-appearance:textfield]"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {ageError && <p className="text-red-400">{ageError}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-white/80">
          Email
        </label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          placeholder="john@example.com"
          aria-invalid={!!emailError}
          className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {emailError && <p className="text-red-400">{emailError}</p>}
        </div>
      </div>

      <RadioGroup
        idBase="gender"
        label="Gender"
        name="gender"
        defaultValue="other"
        firstRef={genderFirstRef}
        error={genderError}
      />

      {/* Country (custom autocomplete) */}
      <div className="relative">
        <label htmlFor="country" className="mb-1 block text-sm text-white/80">
          Country
        </label>

        <input
          ref={countryInputRef}
          id="country"
          type="text"
          placeholder="Start typing…"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setShowCountries(true);
          }}
          onFocus={(e) => {
            const val = (e.target as HTMLInputElement).value;
            setShowCountries(!!val);
          }}
          onBlur={() => {
            setTimeout(() => setShowCountries(false), 120);
          }}
          autoComplete="off"
          aria-invalid={!!countryError}
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 placeholder:text-white/50"
        />

        {showCountries && country.trim().length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/15 bg-slate-900/95 p-1 shadow-xl backdrop-blur scrollbar-thin">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <li
                  key={c}
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCountry(c);
                    setCountryError(null);
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
          {countryError && <p className="text-red-400">{countryError}</p>}
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-white/80">
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          onChange={(e) => handlePasswordChange(e.target.value)}
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
          {passwordError && <p className="text-red-400">{passwordError}</p>}
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm text-white/80"
        >
          Confirm password
        </label>
        <input
          ref={confirmPasswordRef}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {confirmPasswordError && (
            <p className="text-red-400">{confirmPasswordError}</p>
          )}
        </div>
      </div>

      {/* Picture upload */}
      <div>
        <label htmlFor="picture" className="mb-1 block text-sm text-white/80">
          Upload your picture
        </label>
        <input
          ref={pictureRef}
          id="picture"
          name="picture"
          type="file"
          accept="image/png, image/jpeg"
          className="w-full text-sm text-white/80"
        />
        <div className="mt-1 min-h-[20px] text-sm">
          {pictureError && <p className="text-red-400">{pictureError}</p>}
        </div>
      </div>

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
