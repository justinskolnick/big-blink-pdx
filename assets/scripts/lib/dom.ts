import { Fn, FnRef } from '../types';

export const scrollToRef: FnRef = (ref) => {
  ref.current.scrollIntoView({ behavior: 'smooth' });
};

export const scrollToTop: Fn = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
