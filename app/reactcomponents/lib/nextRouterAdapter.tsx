'use client';

import React, { ReactNode, useMemo, useEffect, useCallback, ComponentProps } from "react";
import NextLink from "next/link";
import {
  usePathname,
  useRouter as useNextRouter,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from "next/navigation";

type To =
  | string
  | {
      pathname?: string;
      query?: Record<string, string | number | boolean | undefined>;
      hash?: string;
      search?: string;
    };

const toHref = (to: To): string => {
  if (typeof to === "string") {
    return to;
  }
  const pathname = to.pathname ?? "";
  let search = "";
  if (to.search) {
    search = to.search.startsWith("?") ? to.search : `?${to.search}`;
  } else if (to.query) {
    const params = new URLSearchParams();
    Object.entries(to.query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) {
      search = `?${queryString}`;
    }
  }
  const hash = to.hash ? (to.hash.startsWith("#") ? to.hash : `#${to.hash}`) : "";
  return `${pathname}${search}${hash}`;
};

type NextLinkProps = ComponentProps<typeof NextLink>;

type LinkProps = {
  to: To;
  children: ReactNode;
} & Omit<NextLinkProps, "href">;

export function Link({ to, replace, scroll = true, children, ...rest }: LinkProps) {
  const href = toHref(to);
  return (
    <NextLink 
      href={href} 
      replace={replace} 
      scroll={scroll}
      prefetch={false}
      {...rest}
    >
      {children}
    </NextLink>
  );
}

type NavigateOptions = {
  replace?: boolean;
};

export function useNavigate() {
  const router = useNextRouter();
  return useCallback((to: To | number, options: NavigateOptions = {}) => {
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
      } else if (to === 0) {
        router.refresh();
      } else {
        window.history.go(to);
      }
      return;
    }
    const href = toHref(to);
    if (options.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  return useMemo(() => {
    const searchString = searchParams.toString();
    const search = searchString ? `?${searchString}` : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    return {
      pathname,
      search,
      hash,
      state: undefined,
      key: "next",
    };
  }, [pathname, searchParams]);
}

export function useSearchParams() {
  const router = useNextRouter();
  const searchParams = useNextSearchParams();
  const setSearchParams = useCallback((param: URLSearchParams | Record<string, string>) => {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";
    let search: string;
    if (param instanceof URLSearchParams) {
      search = param.toString();
    } else {
      const params = new URLSearchParams();
      Object.entries(param).forEach(([key, value]) => {
        params.set(key, value);
      });
      search = params.toString();
    }
    router.push(`${pathname}${search ? `?${search}` : ""}`);
  }, [router]);
  return [searchParams, setSearchParams] as const;
}

export function useParams<T extends Record<string, string>>() {
  return useNextParams() as unknown as T;
}

type NavigateComponentProps = {
  to: To;
  replace?: boolean;
};

export function Navigate({ to, replace }: NavigateComponentProps) {
  const router = useNextRouter();
  const href = toHref(to);
  useEffect(() => {
    // Immediate scroll to top before navigation (unless there's a hash)
    if (!href.includes('#') && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [href, replace, router]);
  return null;
}

