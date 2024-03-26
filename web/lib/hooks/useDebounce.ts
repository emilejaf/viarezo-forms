import { useCallback } from "react";

export default function useDebounce<F extends (...args: any[]) => any>(
  fn: F,
  delay = 500
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(fn, delay), [fn]);
}

export const debounce = <F extends (...args: any[]) => any>(
  fn: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(fn(...args)), waitFor);
    });
};
