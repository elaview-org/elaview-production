// src/components/notifications/NotificationBadge.tsx
interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NotificationBadge({
  count,
  variant = 'default',
  size = 'md',
  className = '',
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const variantClasses = {
    default: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-orange-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const sizeClasses = {
    sm: 'h-4 w-4 text-[10px]',
    md: 'h-5 w-5 text-xs',
    lg: 'h-6 w-6 text-sm',
  };

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-bold
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  );
}
