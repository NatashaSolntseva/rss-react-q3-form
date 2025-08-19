import * as yup from 'yup';

import type { Gender } from '../model/types';
import { passwordChecks } from '@/shared/utils/passwordCheck';

export const schema = yup
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

export type TFormFieldsValues = yup.InferType<typeof schema>;
