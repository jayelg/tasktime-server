declare module 'express' {
  export interface Request {
    user: {
      id: number;
      email: string;
    };
    params: {
      orgId: number;
      projectId: number;
    };
  }
}
