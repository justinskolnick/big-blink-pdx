import { Fn, FnRef, FnRefDelay } from '../types';

export const scrollToRef: FnRef = (ref) => {
  ref.current.scrollIntoView({ behavior: 'smooth' });
};

export const delayedScrollToRef: FnRefDelay = (ref, delay = 250) => {
  setTimeout(() => {
    scrollToRef(ref);
  }, delay);
};

export const scrollToTop: Fn = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
