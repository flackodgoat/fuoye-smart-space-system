import { cn } from '../../utils/cn'

const CONFIG = {
  available: {
    label: 'Available',
    dotClass: 'bg-green-500',
    className: 'bg-green-50 text-green-700 border-green-100',
  },
  limited: {
    label: 'Limited',
    dotClass: 'bg-amber-500',
    className: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  full: {
    label: 'Full',
    dotClass: 'bg-red-500',
    className: 'bg-red-50 text-red-600 border-red-100',
  },
}

export default function AvailabilityBadge({ status = 'available', showDot = true, className }) {
  const cfg = CONFIG[status] ?? CONFIG.available
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
        cfg.className,
        className,
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse', cfg.dotClass)} />
      )}
      {cfg.label}
    </span>
  )
}
