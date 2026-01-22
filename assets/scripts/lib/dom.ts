import { Fn, FnDelay, FnRef, FnRefBoolean, FnRefDelay } from '../types';

export const isRefTopInView: FnRefBoolean = (ref) =>
  ref.current.offsetTop >= window.scrollY;

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

export const delayedScrollToTop: FnDelay = (delay = 250) => {
  setTimeout(() => {
    scrollToTop();
  }, delay);
};
