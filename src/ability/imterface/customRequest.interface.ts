declare module 'express' {
  export interface Request {
    user: {
      id: string;
      email: string;
    };
    params: {
      orgId: string;
      projectId: string;
      itemId: string;
    };
  }
}
