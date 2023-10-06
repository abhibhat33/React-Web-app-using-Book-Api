import { atom } from 'recoil';

export const appPageData = atom({
  key:     'appPageData',
  default: null
});

export const appPageError = atom({
  key:     'appPageError',
  default: null
});

export const searchIsLoading = atom({
  key:     'searchIsLoading',
  default: false
});
