export interface IMember {
  _id: string;
  role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  disabled?: boolean;
}
