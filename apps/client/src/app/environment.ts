import { isDevMode } from '@angular/core';

const isDev = isDevMode();

export const environment = {
  production: true,
  baseApiUrl: isDev ? 'http://localhost:3000' : 'https://books-api.beetonica.com',
  apiUrlV1: isDev ? 'http://localhost:3050/api/v1' : 'https://books-api.beetonica.com/api/v1',
};
