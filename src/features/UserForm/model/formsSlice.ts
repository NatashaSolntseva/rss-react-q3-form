import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Gender } from './types';
import { mockEntries } from '@/shared/mocks/mockEntries';

export type FormEntry = {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  country: string;
  pictureBase64?: string;
  createdAt: number;
  source: 'rhf' | 'uncontrolled';
};

type FormsState = {
  entries: FormEntry[];
};

const initialState: FormsState = {
  entries: mockEntries,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<FormEntry>) {
      state.entries.unshift(action.payload);
    },
  },
});

export const { addEntry } = formsSlice.actions;
export default formsSlice.reducer;
