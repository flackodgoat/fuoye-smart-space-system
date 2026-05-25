import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:   'bg-[#0B5D1E] text-white hover:bg-[#084415] shadow-sm hover:shadow-md focus:ring-[#0B5D1E]/30',
  secondary: 'bg-[#6DBE45] text-white hover:bg-[#5aab35] shadow-sm hover:shadow-md focus:ring-[#6DBE45]/30',
  outline:   'border-2 border-[#0B5D1E] text-[#0B5D1E] bg-transparent hover:bg-[#0B5D1E]/5 focus:ring-[#0B5D1E]/20',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md focus:ring-red-400/30',
}

const sizes = {
  sm: 'h-7  px-3   text-xs  gap-1.5 rounded-lg',
  md: 'h-9  px-4   text-sm  gap-2   rounded-xl',
  lg: 'h-11 px-5   text-sm  gap-2   rounded-xl',
}

const iconSizes = { sm: 13, md: 15, lg: 16 }

/**
 * Button — primary reusable action component.
 *
 * Props:
 *   variant      — 'primary' | 'secondary' | 'outline' | 'danger'
 *   size         — 'sm' | 'md' | 'lg'
 *   loading      — shows spinner and disables interaction
 *   disabled     — disables interaction
 *   icon         — lucide-react icon component
 *   iconPosition — 'left' (default) | 'right'
 *   fullWidth    — stretches to container width
 *   type         — html button type, default 'button'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading
  const px = iconSizes[size]

  const leftEl = loading
    ? <Loader2 size={px} className="animate-spin flex-shrink-0" />
    : Icon && iconPosition === 'left'
      ? <Icon size={px} className="flex-shrink-0" />
      : null

  const rightEl = !loading && Icon && iconPosition === 'right'
    ? <Icon size={px} className="flex-shrink-0" />
    : null

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'active:scale-[0.98]',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftEl}
      {children && <span>{children}</span>}
      {rightEl}
    </button>
  )
}
