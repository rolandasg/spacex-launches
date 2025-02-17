import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
  onIntersect: () => void,
  loading: boolean,
  hasMore: boolean,
) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting && hasMore) {
        onIntersect();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect, loading, hasMore]);

  return observerRef;
};
