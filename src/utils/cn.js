/**
 * Merges class strings, filtering out falsy values.
 *
 * Usage:
 *   cn('base', condition && 'conditional', 'another')
 *   cn('text-sm', isActive ? 'text-green-700' : 'text-gray-500')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
