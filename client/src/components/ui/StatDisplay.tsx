interface StatDisplayProps {
  label: string;
  value: number;
  icon?: string;
  className?: string;
}

export default function StatDisplay({ label, value, icon, className = '' }: StatDisplayProps) {
  return (
    <div className={`flex items-center gap-3 bg-void-900 rounded-lg px-4 py-3 ${className}`}>
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex-1">
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          {label}
        </div>
        <div className="text-xl font-display font-bold text-gray-100">{value}</div>
      </div>
    </div>
  );
}
