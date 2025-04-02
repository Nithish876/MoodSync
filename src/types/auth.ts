import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string | null;
  name: string;
  friendCode: string;
  friends: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}