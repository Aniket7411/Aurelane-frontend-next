'use client';

import NextLink from 'next/link';
import {
  useRouter,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
  usePathname,
} from 'next/navigation';
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';

type NavigateOptions = {
  replace?: boolean;
  scroll?: boolean;
};

type SearchParamsInit =
  | string
  | URLSearchParams
  | string[][]
  | Record<string, string>
  | Record<string, string | string[]>
  | Iterable<[string, string]>;

const toHref = (to: string | { pathname: string; search?: string }) => {
  if (typeof to === 'string') {
    return to;
  }

  const search =
    typeof to.search === 'string' && to.search.length > 0
      ? to.search.startsWith('?')
        ? to.search
        : `?${to.search}`
      : '';

  return `${to.pathname}${search}`;
};

export const Link = ({
  to,
  replace,
  children,
  prefetch,
  ...rest
}: PropsWithChildren<{
  to: string | { pathname: string; search?: string };
  replace?: boolean;
  prefetch?: boolean;
}> & Record<string, unknown>) => {
  const href = toHref(to);

  return (
    <NextLink href={href} replace={replace} prefetch={prefetch} {...rest}>
      {children}
    </NextLink>
  );
};

export const useNavigate = () => {
  const router = useRouter();

  return useCallback(
    (to: string | number, options: NavigateOptions = {}) => {
      if (typeof to === 'number') {
        if (to < 0) {
          router.back();
        } else if (to > 0) {
          router.forward();
        }
        return;
      }

      if (options.replace) {
        router.replace(to, { scroll: options.scroll ?? true });
      } else {
        router.push(to, { scroll: options.scroll ?? true });
      }
    },
    [router]
  );
};

export const useParams = useNextParams;

const stringifySearchParams = (init: SearchParamsInit) => {
  if (typeof init === 'string') {
    return init.startsWith('?') ? init.slice(1) : init;
  }
  if (init instanceof URLSearchParams) {
    return init.toString();
  }
  if (Array.isArray(init)) {
    const params = new URLSearchParams(init as string[][]);
    return params.toString();
  }
  if (typeof (init as Iterable<unknown>)[Symbol.iterator] === 'function') {
    // Convert Iterable to Array for URLSearchParams
    const entries = Array.from(init as Iterable<[string, string]>);
    const params = new URLSearchParams(entries);
    return params.toString();
  }
  const params = new URLSearchParams();
  Object.entries(init as Record<string, string | string[]>).forEach(
    ([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else {
        params.set(key, value);
      }
    }
  );
  return params.toString();
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback(
    (nextInit: SearchParamsInit, options: NavigateOptions = {}) => {
      const searchString = stringifySearchParams(nextInit);
      const url = searchString ? `${pathname}?${searchString}` : pathname;

      if (options.replace) {
        router.replace(url, { scroll: options.scroll ?? true });
      } else {
        router.push(url, { scroll: options.scroll ?? true });
      }
    },
    [pathname, router]
  );

  return [searchParams, setSearchParams] as const;
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  return useMemo(
    () => ({
      pathname,
      search: searchParams.size ? `?${searchParams.toString()}` : '',
      hash: '',
      state: undefined,
      key: `${pathname}?${searchParams.toString()}`,
    }),
    [pathname, searchParams]
  );
};

export const Navigate = ({
  to,
  replace,
}: {
  to: string;
  replace?: boolean;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
};

