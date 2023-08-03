export interface INotification {
  _id: string;
  user: string;
  createdAt: string;
  unread: boolean;
  title: string;
  body: string;
  button: string;
  type: string;
  reference: string;
}
