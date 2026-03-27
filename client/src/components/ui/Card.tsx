interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'neon' | 'arcane' | 'none';
}

export default function Card({ children, className = '', glow = 'none' }: CardProps) {
  const glowStyles = {
    neon: 'border-neon-500/20 shadow-neon/5',
    arcane: 'border-arcane-500/20 shadow-arcane/5',
    none: 'border-void-600',
  };

  return (
    <div
      className={`bg-void-800 border rounded-xl p-5 ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
