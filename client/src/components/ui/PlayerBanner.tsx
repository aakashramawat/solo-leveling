import { useState, useEffect } from 'react';
import type { PlayerRank } from '@solo-leveling/shared';
import Badge from './Badge';
import ProgressBar from './ProgressBar';

const RANK_COLORS: Record<PlayerRank, string> = {
  E:  '#4b5563', // dim gray — barely registered by the System
  D:  '#6b7280', // steel gray — low hunter
  C:  '#60a5fa', // neon blue — System takes notice
  B:  '#38bdf8', // sky cyan — capable hunter
  A:  '#a78bfa', // arcane violet — elite
  S:  '#8b5cf6', // arcane purple — peak of normal humanity
  S2: '#c084fc', // bright purple — beyond national level
  S3: '#e879f9', // fuchsia — approaching monarch tier
  S4: '#d946ef', // deep fuchsia — near-monarch
  S5: '#eab308', // monarch gold — Shadow Monarch
};

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

interface PlayerBannerProps {
  name: string;
  rank: PlayerRank;
  title: string;
  xp: number;
  xpToEnter: number;
  xpToPass: number;
  className?: string;
}

export default function PlayerBanner({ name, rank, title, xp, xpToEnter, xpToPass, className = '' }: PlayerBannerProps) {
  const [imgError, setImgError] = useState(false);
  const isMaxRank = rank === 'S5' && xp >= xpToPass;

  useEffect(() => {
    setImgError(false);
  }, [rank]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-void-600 ${className}`}>
      {/* Full-width image at natural aspect ratio */}
      {!imgError ? (
        <img
          src={RANK_AVATAR[rank]}
          alt={`${rank} rank`}
          className="w-full h-auto block"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full aspect-[16/9] bg-void-900 flex items-center justify-center">
          <span className="text-6xl font-display font-black text-arcane-400">{name[0]}</span>
        </div>
      )}

      {/* Rank emblem — top-right corner */}
      <div className="absolute top-3 right-4 flex flex-col items-center select-none pointer-events-none">
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: '4rem',
            color: RANK_COLORS[rank],
            textShadow: `0 0 20px ${RANK_COLORS[rank]}, 0 0 40px ${RANK_COLORS[rank]}80, 0 2px 4px rgba(0,0,0,0.8)`,
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
        >
          {rank}
        </span>
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: `${RANK_COLORS[rank]}cc` }}
        >
          RANK
        </span>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-xl font-display font-bold text-white drop-shadow-lg">
            {name}
          </h3>
          <Badge rank={rank} size="md" />
        </div>
        <p className="text-xs font-mono text-gray-300/80 mb-2">{title}</p>
        {isMaxRank ? (
          <p className="text-xs font-mono text-xp font-bold">MAX RANK</p>
        ) : (
          <>
            <ProgressBar
              value={xp - xpToEnter}
              max={xpToPass - xpToEnter}
              color="xp"
              size="sm"
            />
            <p className="text-[10px] font-mono text-gray-400 mt-1">
              {(xpToPass - xp).toLocaleString()} XP to next rank
            </p>
          </>
        )}
      </div>
    </div>
  );
}
