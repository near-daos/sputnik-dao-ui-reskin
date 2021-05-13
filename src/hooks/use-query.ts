import { useLocation } from 'react-router-dom';

const useQuery = <T>(): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {};
  const urlSearchParams = new URLSearchParams(useLocation().search);

  urlSearchParams.forEach((value: string, key: string) => {
    params[key] = value;
  });

  return params as T;
};

export default useQuery;
