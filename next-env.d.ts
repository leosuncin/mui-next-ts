/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />
import('jest-fetch-mock');

declare namespace NodeJS {
  export interface ProcessEnv {
    readonly PORT: string;
    readonly APP_SECRET: string;
  }
}
