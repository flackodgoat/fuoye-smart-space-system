import { cn } from '../../utils/cn'

const styles = {
  success: 'bg-green-100  text-green-700',
  warning: 'bg-amber-100  text-amber-700',
  info:    'bg-blue-100   text-blue-700',
  danger:  'bg-red-100    text-red-600',
  neutral: 'bg-gray-100   text-gray-600',
}

const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
  danger:  'bg-red-500',
  neutral: 'bg-gray-400',
}

/**
 * Badge — inline status/label pill.
 *
 * Props:
 *   variant  — 'success' | 'warning' | 'info' | 'danger' | 'neutral'
 *   dot      — shows a colored indicator dot before the text
 *   className — additional classes
 */
export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-0.5 rounded-full',
        'text-[11px] font-semibold leading-none',
        styles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  )
}
