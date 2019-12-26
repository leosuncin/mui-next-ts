/// <reference types="next" />
/// <reference types="next/types/global" />
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly PORT: string;
    readonly APP_SECRET: string;
  }
}
