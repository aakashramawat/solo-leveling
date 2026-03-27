import { useEffect, useState, useCallback } from 'react';
import type { TaskCategory } from '@solo-leveling/shared';

interface CategoryCounts {
  total: number;
  [key: string]: number;
}

interface DailyTask {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'failed';
  xpGain: number;
  xpLoss: number;
}

interface DailyData {
  date: string;
  required: CategoryCounts;
  completed: CategoryCounts;
  failed: CategoryCounts;
  xpGainedToday: number;
  xpLostToday: number;
  xpNetToday: number;
  tasks: DailyTask[];
}

export type { DailyTask };

export function useDaily() {
  const [daily, setDaily] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDaily = useCallback(async () => {
    try {
      const res = await fetch('/api/daily');
      const json = await res.json();
      if (json.success) setDaily(json.data);
    } catch (err) {
      console.error('Failed to fetch daily:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  const markTask = async (category: TaskCategory, done: boolean, subtitle?: string) => {
    try {
      await fetch('/api/daily/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, done, subtitle }),
      });
      await fetchDaily();
    } catch (err) {
      console.error('Failed to mark task:', err);
    }
  };

  const unmarkTask = async (taskId: string) => {
    try {
      await fetch('/api/daily/unmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      await fetchDaily();
    } catch (err) {
      console.error('Failed to unmark task:', err);
    }
  };

  return { daily, loading, refetch: fetchDaily, markTask, unmarkTask };
}
