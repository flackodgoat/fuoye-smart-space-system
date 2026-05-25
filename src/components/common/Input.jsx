import { useState, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Input — reusable form field component.
 *
 * Props:
 *   label       — field label text
 *   error       — error message string (triggers red state)
 *   hint        — helper text shown below field when no error
 *   leftIcon    — lucide-react icon rendered inside left edge
 *   rightIcon   — lucide-react icon rendered inside right edge
 *   required    — appends * to label
 *   type        — html input type; 'password' activates visibility toggle
 *   id          — overrides auto-generated id
 *   className   — applied to the <input> element
 *   wrapperClassName — applied to the outer container div
 */
export default function Input({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  required = false,
  type = 'text',
  id,
  className,
  wrapperClassName,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const autoId = useId()
  const inputId = id ?? autoId

  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasRightSlot = isPassword || !!RightIcon

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-600 select-none"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {LeftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <LeftIcon size={15} />
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          className={cn(
            'w-full rounded-xl border text-sm text-gray-700',
            'py-2.5 outline-none transition-all duration-200',
            'placeholder:text-gray-400',
            LeftIcon ? 'pl-10' : 'pl-4',
            hasRightSlot ? 'pr-11' : 'pr-4',
            error
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
              : 'border-gray-200 bg-gray-50 focus:border-[#0B5D1E] focus:ring-2 focus:ring-[#0B5D1E]/20 focus:bg-white',
            className,
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}

        {/* Right icon (non-password) */}
        {!isPassword && RightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <RightIcon size={15} />
          </span>
        )}
      </div>

      {/* Feedback text */}
      {error && (
        <p className="text-red-500 text-[11px] leading-snug">{error}</p>
      )}
      {!error && hint && (
        <p className="text-gray-400 text-[11px] leading-snug">{hint}</p>
      )}
    </div>
  )
}
