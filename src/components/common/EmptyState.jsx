import { cn } from '../../utils/cn'

/**
 * EmptyState — zero-data placeholder for lists, tables, and sections.
 *
 * Props:
 *   icon        — lucide-react icon component
 *   title       — primary message
 *   description — secondary helper text
 *   action      — ReactNode rendered below description (e.g. a <Button />)
 *   className   — applied to the container
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-12 px-6',
        className,
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 flex-shrink-0">
          <Icon size={26} className="text-gray-400" />
        </div>
      )}

      {title && (
        <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      )}

      {description && (
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
