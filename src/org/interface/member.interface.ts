export interface IMember {
  id: number;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  disabled?: boolean;
}
