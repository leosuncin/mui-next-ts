declare namespace NodeJS {
  export interface ProcessEnv {
    readonly PORT: string;
    readonly APP_SECRET: string;
  }
}
