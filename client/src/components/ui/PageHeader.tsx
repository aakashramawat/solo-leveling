interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl font-display font-bold tracking-wide text-gray-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-mono text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
