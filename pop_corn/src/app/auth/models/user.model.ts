export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'MASTER';
  avatarUrl: string; 
  cinemaId?: number | null; 
}
