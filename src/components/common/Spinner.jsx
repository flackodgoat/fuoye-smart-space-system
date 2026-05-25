import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const sizes = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4   h-4',
  md: 'w-6   h-6',
  lg: 'w-8   h-8',
  xl: 'w-12  h-12',
}

/**
 * Spinner — reusable loading indicator.
 *
 * Props:
 *   size      — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   color     — tailwind text color class, defaults to FUOYE green
 *   centered  — wraps in a flex-center container (useful for full-section loaders)
 *   label     — accessible screen-reader label
 *   className — applied to the icon (or wrapper when centered)
 */
export default function Spinner({
  size = 'md',
  color = 'text-[#0B5D1E]',
  centered = false,
  label = 'Loading...',
  className,
}) {
  const icon = (
    <>
      <Loader2
        className={cn('animate-spin flex-shrink-0', sizes[size], color)}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </>
  )

  if (centered) {
    return (
      <div
        role="status"
        className={cn('flex items-center justify-center', className)}
      >
        {icon}
      </div>
    )
  }

  return (
    <span role="status" className={cn('inline-flex', className)}>
      {icon}
    </span>
  )
}
