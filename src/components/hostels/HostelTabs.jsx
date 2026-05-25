import { Building2, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

const TABS = [
  { label: 'School Hostels',  value: 'school',  icon: Building2 },
  { label: 'Private Hostels', value: 'private', icon: Home },
]

export default function HostelTabs({ activeTab, onChange, counts = {} }) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-100">
      {TABS.map(({ label, value, icon: Icon }) => {
        const isActive = activeTab === value
        const count    = counts[value] ?? 0
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px',
              'transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'border-[#0B5D1E] text-[#0B5D1E]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
            )}
          >
            <Icon size={15} className="flex-shrink-0" />
            {label}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                isActive
                  ? 'text-[#0B5D1E]'
                  : 'bg-gray-100 text-gray-500',
              )}
              style={isActive ? { backgroundColor: '#e8f5e9' } : {}}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
