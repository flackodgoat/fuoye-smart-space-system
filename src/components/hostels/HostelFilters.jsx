import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '../common'
import { cn } from '../../utils/cn'

const GENDER_OPTIONS = [
  { label: 'All',    value: 'all' },
  { label: 'Female', value: 'Female' },
  { label: 'Male',   value: 'Male' },
  { label: 'Mixed',  value: 'Mixed' },
]

const STATUS_OPTIONS = [
  { label: 'Any Status', value: 'all' },
  { label: 'Available',  value: 'available' },
  { label: 'Limited',    value: 'limited' },
  { label: 'Full',       value: 'full' },
]

const PRICE_OPTIONS = [
  { label: 'Any Price',     value: 'all' },
  { label: '< ₦20k',        value: 'budget' },
  { label: '₦20k – ₦50k',   value: 'mid' },
  { label: '₦50k+',         value: 'premium' },
]

const DISTANCE_OPTIONS = [
  { label: 'Any Distance', value: 'all' },
  { label: '< 10 min',     value: '10min' },
  { label: '< 20 min',     value: '20min' },
]

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-[11px] font-semibold transition-all border whitespace-nowrap',
        active
          ? 'text-white border-transparent'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
      )}
      style={active ? { backgroundColor: '#0B5D1E', borderColor: '#0B5D1E' } : {}}
    >
      {label}
    </button>
  )
}

function FilterRow({ icon: Icon, label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Icon && <Icon size={13} className="text-gray-400 flex-shrink-0" />}
      {label && <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">{label}</span>}
      {options.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  )
}

export default function HostelFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  activeTab,
  hasActiveFilters,
  onClear,
}) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <Input
        placeholder="Search by hostel name, code, or location…"
        leftIcon={Search}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Gender + Status row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />
        {GENDER_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.gender === opt.value}
            onClick={() => onFilterChange('gender', opt.value)}
          />
        ))}
        <div className="h-4 w-px bg-gray-200 flex-shrink-0" />
        {STATUS_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.status === opt.value}
            onClick={() => onFilterChange('status', opt.value)}
          />
        ))}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Price + Distance row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400 font-medium flex-shrink-0 w-[13px]" />
        {PRICE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.price === opt.value}
            onClick={() => onFilterChange('price', opt.value)}
          />
        ))}
        {activeTab === 'private' && (
          <>
            <div className="h-4 w-px bg-gray-200 flex-shrink-0" />
            {DISTANCE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filters.distance === opt.value}
                onClick={() => onFilterChange('distance', opt.value)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
