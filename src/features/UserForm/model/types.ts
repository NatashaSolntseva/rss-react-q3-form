export type Gender = 'female' | 'male' | 'other';

export interface IFormData {
  name: string;
  age: number | '';
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  acceptTnC: boolean;
  pictureBase64?: string;
  country: string;
}
