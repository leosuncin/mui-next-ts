export type Error = {
  readonly statusCode: number;
  readonly message: string;
  readonly errors?: Record<string, string>;
};
