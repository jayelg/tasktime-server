// shape of user.schema.ts
// represents object returned from db
export class UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  disabled: boolean;

  constructor(data: UserDto) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.disabled = data.disabled;
  }
}
