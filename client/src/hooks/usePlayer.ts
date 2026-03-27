import { useEffect, useState } from 'react';
import type { Player } from '@solo-leveling/shared';

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlayer = async () => {
    try {
      const res = await fetch('/api/player');
      const json = await res.json();
      if (json.success) setPlayer(json.data);
    } catch (err) {
      console.error('Failed to fetch player:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  return { player, loading, refetch: fetchPlayer };
}
