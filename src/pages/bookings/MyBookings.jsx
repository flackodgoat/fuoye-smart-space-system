import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Users,
  BookOpen,
  Plus,
} from 'lucide-react'
import { Card, Badge, Button, EmptyState } from '../../components/common'
import {
  getBookings,
  saveBookings,
  cancelBooking,
  addNotification,
  timeAgo,
  formatDate,
} from '../../utils/storage'
import { mockBookings } from '../../data/bookings'

const STATUS_CONFIG = {
  confirmed:  { variant: 'success', label: 'Confirmed' },
  pending:    { variant: 'warning', label: 'Pending' },
  completed:  { variant: 'neutral', label: 'Completed' },
  cancelled:  { variant: 'danger',  label: 'Cancelled' },
}

const TABS = [
  { label: 'All',       value: 'all' },
  { label: 'Upcoming',  value: 'confirmed' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

function canCancel(b) {
  return b.status === 'pending' || b.status === 'confirmed'
}

export default function MyBookings() {
  const [bookings, setBookings]         = useState([])
  const [activeTab, setActiveTab]       = useState('all')
  const [cancellingId, setCancellingId] = useState(null)

  // Seed mock bookings on first visit, then always read from localStorage
  useEffect(() => {
    const stored    = getBookings()
    const storedIds = new Set(stored.map((b) => b.id))
    const toAdd     = mockBookings.filter((b) => !storedIds.has(b.id))
    if (toAdd.length > 0) saveBookings([...stored, ...toAdd])
    refresh()
  }, [])

  function refresh() {
    const all = getBookings()
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setBookings(all)
  }

  async function handleCancel(id) {
    setCancellingId(id)
    await new Promise((r) => setTimeout(r, 700))
    const booking = bookings.find((b) => b.id === id)
    cancelBooking(id)
    if (booking) {
      addNotification({
        type:      'booking_cancelled',
        bookingId: id,
        message:   `Booking for ${booking.roomCode} on ${formatDate(booking.date)} was cancelled.`,
      })
    }
    setCancellingId(null)
    refresh()
  }

  const filtered =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab)

  const tabCount = (val) =>
    val === 'all' ? bookings.length : bookings.filter((b) => b.status === val).length

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track and manage all your space reservations
          </p>
        </div>
        <Link to="/classroom">
          <Button icon={Plus} size="sm">New Booking</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {TABS.map(({ label, value }) => {
          const count    = tabCount(value)
          const isActive = activeTab === value
          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={
                isActive
                  ? { backgroundColor: '#0B5D1E', color: '#fff', borderColor: '#0B5D1E' }
                  : { backgroundColor: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
              }
            >
              {label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={
                  isActive
                    ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#9ca3af' }
                }
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Booking list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={handleCancel}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <EmptyState
            icon={BookOpen}
            title={
              activeTab === 'all'
                ? 'No bookings yet'
                : `No ${TABS.find((t) => t.value === activeTab)?.label.toLowerCase()} bookings`
            }
            description={
              activeTab === 'all'
                ? 'You have not made any bookings. Reserve a classroom or hostel space to get started.'
                : 'No bookings in this category at the moment.'
            }
            action={
              activeTab === 'all' ? (
                <Link to="/classroom">
                  <Button icon={Plus}>Book a Space</Button>
                </Link>
              ) : null
            }
          />
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b, onCancel, cancellingId }) {
  const { variant, label } = STATUS_CONFIG[b.status] ?? { variant: 'neutral', label: b.status }
  const isCancelling = cancellingId === b.id

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 100%)',
              fontSize:   b.roomCode.length > 3 ? '9px' : '11px',
            }}
          >
            {b.roomCode}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{b.roomName}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{b.purpose}</p>
          </div>
        </div>
        <Badge variant={variant} dot className="flex-shrink-0">{label}</Badge>
      </div>

      {/* Details row */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays size={12} className="text-gray-400 flex-shrink-0" />
          {formatDate(b.date)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} className="text-gray-400 flex-shrink-0" />
          {b.startTime} · {b.duration}
        </span>
        {b.attendees && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={12} className="text-gray-400 flex-shrink-0" />
            {b.attendees} attendees
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] text-gray-400">
            Submitted {timeAgo(b.createdAt)}
          </span>
          {canCancel(b) && (
            <Button
              size="sm"
              variant="danger"
              loading={isCancelling}
              onClick={() => onCancel(b.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
