interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'xp' | 'hp' | 'mp' | 'neon' | 'arcane';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  color = 'xp',
  showLabel = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const colors = {
    xp: 'bg-xp',
    hp: 'bg-hp',
    mp: 'bg-mp',
    neon: 'bg-neon-500',
    arcane: 'bg-arcane-500',
  };

  const glows = {
    xp: 'shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    hp: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    mp: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]',
    neon: 'shadow-neon',
    arcane: 'shadow-arcane',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
          <span>
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
          <span>{Math.floor(percent)}%</span>
        </div>
      )}
      <div className={`w-full bg-void-900 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-500 ease-out ${colors[color]} ${glows[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
