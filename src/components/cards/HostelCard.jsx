import { MapPin, BedDouble, Lock } from 'lucide-react'
import { Badge, Button } from '../common'
import { cn } from '../../utils/cn'

const genderGradients = {
  Female: 'linear-gradient(135deg, #AD1457 0%, #880E4F 100%)',
  Male:   'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
}

function OccupancyBar({ rate }) {
  const color = rate >= 90 ? '#ef4444' : rate >= 75 ? '#f59e0b' : '#22c55e'
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${rate}%`, backgroundColor: color }}
      />
    </div>
  )
}

export default function HostelCard({ hostel, onBook }) {
  const {
    code, name, gender, location,
    occupancyRate, availableRooms, totalRooms,
    roomTypes, status,
  } = hostel

  const isFull    = status === 'full'
  const gradient  = genderGradients[gender] ?? 'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 100%)'
  const rateColor = occupancyRate >= 90 ? '#ef4444' : occupancyRate >= 75 ? '#d97706' : '#16a34a'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

      {/* Gradient header */}
      <div
        className="h-16 flex items-center justify-between px-4 relative overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      >
        <div className="absolute -right-5 -top-5 w-16 h-16 rounded-full bg-white opacity-10" />
        <span className="text-white text-2xl font-black tracking-wide relative z-10">{code}</span>
        <div className="relative z-10">
          <Badge variant={isFull ? 'danger' : 'success'} dot>
            {isFull ? 'Full' : 'Available'}
          </Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Name + gender */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug">{name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{gender} Hostel</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} className="flex-shrink-0 text-gray-400" />
          <span className="truncate">{location}</span>
        </div>

        {/* Occupancy */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Occupancy
            </span>
            <span className="text-[10px] font-bold" style={{ color: rateColor }}>
              {occupancyRate}%
            </span>
          </div>
          <OccupancyBar rate={occupancyRate} />
          <p className="text-[10px] text-gray-400">
            {availableRooms} of {totalRooms} rooms available
          </p>
        </div>

        {/* Room type chips */}
        <div className="flex flex-wrap gap-1.5">
          {roomTypes.map((rt) => (
            <span
              key={rt.type}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full',
                rt.available > 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-400 line-through',
              )}
            >
              {rt.type}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={cn('mt-auto pt-1', isFull && 'opacity-60')}>
          <Button
            fullWidth
            size="sm"
            variant={isFull ? 'outline' : 'primary'}
            icon={isFull ? Lock : BedDouble}
            disabled={isFull}
            onClick={() => !isFull && onBook(hostel)}
          >
            {isFull ? 'No Beds Available' : 'Book a Bed'}
          </Button>
        </div>
      </div>
    </div>
  )
}
