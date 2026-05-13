export type UserRole = 'admin' | 'manager' | 'developer' | 'designer';

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  role: UserRole;
}

export const USER_ROLES: UserRole[] = ['admin', 'manager', 'developer', 'designer'];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  developer: 'Разработчик',
  designer: 'Дизайнер',
};
