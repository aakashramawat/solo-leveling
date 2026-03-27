import type { PlayerRank } from '@solo-leveling/shared';

interface BadgeProps {
  rank: PlayerRank;
  size?: 'sm' | 'md';
  className?: string;
}

const rankStyles: Record<PlayerRank, string> = {
  E:  'bg-rank-E/10 text-rank-E border-rank-E/20',
  D:  'bg-rank-D/10 text-rank-D border-rank-D/20',
  C:  'bg-rank-C/10 text-rank-C border-rank-C/20',
  B:  'bg-rank-B/10 text-rank-B border-rank-B/20',
  A:  'bg-rank-A/10 text-rank-A border-rank-A/20',
  S:  'bg-rank-S/10 text-rank-S border-rank-S/20',
  S2: 'bg-rank-S2/10 text-rank-S2 border-rank-S2/20',
  S3: 'bg-rank-S3/10 text-rank-S3 border-rank-S3/20',
  S4: 'bg-rank-S4/10 text-rank-S4 border-rank-S4/20',
  S5: 'bg-rank-S5/10 text-rank-S5 border-rank-S5/20',
};

export default function Badge({ rank, size = 'md', className = '' }: BadgeProps) {
  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-display font-bold border rounded tracking-wider ${rankStyles[rank]} ${sizes[size]} ${className}`}
    >
      {rank}-Rank
    </span>
  );
}
