import React, { useRef, useCallback, useEffect } from 'react';

export type UseInfiniteScrollHookArgs = {
  initialLoad: boolean;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: VoidFunction;
  threshold: number;
};

export type UseInfiniteScrollHookResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchorRef: (node: any) => void;
  infiniteScrollAnchor: JSX.Element;
};

const useInfiniteScroll = ({
  initialLoad,
  isLoading,
  hasMore,
  onLoadMore,
  threshold,
}: UseInfiniteScrollHookArgs): UseInfiniteScrollHookResult => {
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (initialLoad) {
      onLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anchorRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore],
  );

  const infiniteScrollAnchor = (
    <div ref={anchorRef} style={{ transform: `translateY(-${threshold}px)` }} />
  );

  return { anchorRef, infiniteScrollAnchor };
};

export default useInfiniteScroll;
