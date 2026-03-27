import { useState, useEffect } from 'react';
import type { PlayerRank } from '@solo-leveling/shared';

const RANK_AVATAR: Record<PlayerRank, string> = {
  E: '/ranks/E.jpg',
  D: '/ranks/D.jpg',
  C: '/ranks/C.jpg',
  B: '/ranks/B.jpg',
  A: '/ranks/A.jpg',
  S: '/ranks/S.jpg',
  S2: '/ranks/S2.jpg',
  S3: '/ranks/S3.jpg',
  S4: '/ranks/S4.jpg',
  S5: '/ranks/S5.jpg',
};

interface RankAvatarProps {
  rank: PlayerRank;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export default function RankAvatar({ rank, name, size = 'lg', className = '' }: RankAvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [rank]);

  return (
    <div className={`${sizes[size]} rounded-xl bg-void-900 border border-arcane-500/20 flex items-center justify-center overflow-hidden ${className}`}>
      {!imgError ? (
        <img
          src={RANK_AVATAR[rank]}
          alt={`${rank} rank`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${textSizes[size]} font-display font-black text-arcane-400`}>
          {name[0]}
        </span>
      )}
    </div>
  );
}
