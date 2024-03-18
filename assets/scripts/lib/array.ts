type item = number | string;

export const unique = (arr: item[]) => [...new Set(arr)];
