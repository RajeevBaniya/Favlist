import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';
import type { Entry } from '../types';

interface UseInfiniteEntriesOptions {
  search?: string;
  type?: 'MOVIE' | 'TV_SHOW' | 'ALL';
}

export const useInfiniteEntries = (options?: UseInfiniteEntriesOptions) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const { search, type } = options || {};

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const filterType = type === 'ALL' ? undefined : type;
      const response = await apiClient.getEntries(
        20, 
        nextPageToken || undefined,
        search,
        filterType
      );
      
      setEntries((prev) => [...prev, ...response.data]);
      setNextPageToken(response.pagination.nextPageToken);
      setHasMore(response.pagination.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextPageToken, search, type]);

  const refresh = useCallback(async () => {
    setEntries([]);
    setNextPageToken(null);
    setHasMore(true);
    setError(null);
    setLoading(true);

    try {
      const filterType = type === 'ALL' ? undefined : type;
      const response = await apiClient.getEntries(20, undefined, search, filterType);
      setEntries(response.data);
      setNextPageToken(response.pagination.nextPageToken);
      setHasMore(response.pagination.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [search, type]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      refresh();
    }
  }, [refresh]);

  // Refresh when search or type changes
  useEffect(() => {
    if (initialLoadDone.current) {
      refresh();
    }
  }, [search, type]);

  return {
    entries,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

