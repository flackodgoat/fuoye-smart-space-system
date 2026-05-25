import { cn } from '../../utils/cn'

/**
 * Card — reusable content container.
 *
 * Props:
 *   title          — header title text
 *   subtitle       — header subtitle text
 *   actions        — ReactNode rendered in header right slot (buttons, badges, etc.)
 *   noPadding      — removes default body padding (for tables, custom layouts)
 *   className      — applied to the card root
 *   headerClassName — applied to the header section
 *   bodyClassName  — applied to the body section
 */
export default function Card({
  children,
  title,
  subtitle,
  actions,
  noPadding = false,
  className,
  headerClassName,
  bodyClassName,
  ...props
}) {
  const hasHeader = title || subtitle || actions

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            'flex items-start justify-between px-5 pt-5 pb-4',
            'border-b border-gray-100',
            headerClassName,
          )}
        >
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={cn(!noPadding && 'p-5', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}
