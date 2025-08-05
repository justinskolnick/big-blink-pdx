interface Fn {
  (item: unknown): boolean | null;
}

export const isEmpty: Fn = (item) => {
  if (!item) {
    return true;
  } else if (Array.isArray(item)) {
    return item.length === 0;
  } else if (typeof item === 'object') {
    return isEmpty(Object.values(item));
  } else if (typeof item === 'string') {
    return item.length === 0;
  }

  return null;
};
