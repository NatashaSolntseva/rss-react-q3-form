import type { FormEntry } from '../../features/UserForm/model/formsSlice';

export const mockEntries: FormEntry[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    age: 28,
    email: 'alice@example.com',
    gender: 'female',
    country: 'Canada',
    pictureBase64: 'https://i.pravatar.cc/150?img=47',
    createdAt: Date.now() - 1000 * 60 * 10,
    source: 'rhf',
  },
  {
    id: '2',
    name: 'Bob Smith',
    age: 34,
    email: 'bob@example.com',
    gender: 'male',
    country: 'Germany',
    pictureBase64: 'https://i.pravatar.cc/150?img=12',
    createdAt: Date.now() - 1000 * 60 * 20,
    source: 'uncontrolled',
  },
];
