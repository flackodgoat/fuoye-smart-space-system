import { Users, MapPin, CalendarPlus, Lock, Wrench } from 'lucide-react'
import { Badge, Button } from '../common'
import { cn } from '../../utils/cn'

const statusConfig = {
  available:   { variant: 'success', label: 'Available' },
  booked:      { variant: 'warning', label: 'Booked' },
  maintenance: { variant: 'danger',  label: 'Maintenance' },
}

const facultyGradients = {
  'Multi-Faculty':                     'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 100%)',
  'Faculty of Science':                'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
  'Faculty of Engineering':            'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
  'Faculty of Agriculture':            'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  'Faculty of Education':              'linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)',
  'Faculty of Management Sciences':    'linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)',
  'Faculty of Social Sciences':        'linear-gradient(135deg, #0277BD 0%, #01579B 100%)',
  'Faculty of Arts and Humanities':    'linear-gradient(135deg, #AD1457 0%, #880E4F 100%)',
  'Faculty of Environmental Sciences': 'linear-gradient(135deg, #00695C 0%, #004D40 100%)',
}

const bookButtonConfig = {
  available:   { icon: CalendarPlus, label: 'Book Room',          variant: 'primary' },
  booked:      { icon: Lock,         label: 'Currently Booked',   variant: 'outline' },
  maintenance: { icon: Wrench,       label: 'Under Maintenance',  variant: 'outline' },
}

export default function RoomCard({ room, onBook }) {
  const { code, name, capacity, faculty, building, status, features, available } = room

  const { variant, label }       = statusConfig[status] ?? statusConfig.available
  const { icon, label: btnLabel, variant: btnVariant } = bookButtonConfig[status] ?? bookButtonConfig.available
  const gradient = facultyGradients[faculty] ?? 'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 100%)'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

      {/* Gradient header — shows room code prominently */}
      <div
        className="h-16 flex items-center justify-between px-4 relative overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      >
        <div className="absolute -right-5 -top-5 w-16 h-16 rounded-full bg-white opacity-10" />
        <span className="text-white text-2xl font-black tracking-wide relative z-10">{code}</span>
        <div className="relative z-10">
          <Badge variant={variant} dot>{label}</Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Name + faculty */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug">{name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{faculty}</p>
        </div>

        {/* Capacity + building */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={12} className="flex-shrink-0 text-gray-400" />
            <span>{capacity.toLocaleString()} seats</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="flex-shrink-0 text-gray-400" />
            <span className="truncate">{building}</span>
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5">
          {features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
            >
              {f}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-[10px] font-medium bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              +{features.length - 3} more
            </span>
          )}
        </div>

        {/* CTA — pushed to bottom of card */}
        <div className={cn('mt-auto pt-1', !available && 'opacity-60')}>
          <Button
            fullWidth
            size="sm"
            variant={btnVariant}
            icon={icon}
            disabled={!available}
            onClick={() => available && onBook(room)}
          >
            {btnLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
