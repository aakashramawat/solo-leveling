interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-neon-500 hover:bg-neon-600 text-white shadow-neon/20 hover:shadow-neon/40',
    secondary:
      'bg-void-700 hover:bg-void-600 text-gray-200 border border-void-600',
    ghost: 'text-gray-400 hover:text-gray-200 hover:bg-void-700',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    success: 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`font-medium rounded-lg transition-all duration-200 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
