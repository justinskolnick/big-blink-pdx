interface FnIsEmpty {
  (item: unknown): boolean | null;
}

interface FnSleep {
  (delay: number): void;
}

export const isEmpty: FnIsEmpty = (item) => {
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

export const sleep: FnSleep = async (delay) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await new Promise((resolve, reject) => {
    setInterval(resolve, delay);
  });
};
