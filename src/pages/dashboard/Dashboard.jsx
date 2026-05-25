import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Building2,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp,
} from 'lucide-react'
import {
  getUser,
  getBookings,
  saveBookings,
  mergeRoomStates,
  timeAgo,
} from '../../utils/storage'
import { classrooms } from '../../data/classrooms'
import { hostels }    from '../../data/hostels'
import { mockBookings } from '../../data/bookings'

const quickActions = [
  {
    label:       'Book a Classroom',
    description: 'Reserve a lecture hall or auditorium',
    path:        '/classroom',
    icon:        BookOpen,
    color:       '#0B5D1E',
    bg:          '#e8f5e9',
  },
  {
    label:       'View Hostel Spaces',
    description: 'Check hostel room availability',
    path:        '/hostel',
    icon:        Building2,
    color:       '#1565C0',
    bg:          '#e3f2fd',
  },
  {
    label:       'My Bookings',
    description: 'Track and manage your bookings',
    path:        '/bookings',
    icon:        CalendarCheck,
    color:       '#E65100',
    bg:          '#fff3e0',
  },
]

const activityIcons = {
  success: <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#2e7d32' }} />,
  warning: <AlertCircle  size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#e65100' }} />,
  info:    <Info         size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#1565c0' }} />,
}
const activityBg = { success: '#f1f8f1', warning: '#fff8f1', info: '#f0f4ff' }

function buildActivityFeed(bookings) {
  if (!bookings.length) return []
  return bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((b) => {
      const d = new Date(b.date + 'T00:00:00').toLocaleDateString('en-NG', {
        weekday: 'short', day: 'numeric', month: 'short',
      })
      switch (b.status) {
        case 'confirmed':
          return { id: b.id, text: `${b.roomCode} booking confirmed for ${d} at ${b.startTime}`, type: 'success', time: timeAgo(b.createdAt) }
        case 'pending':
          return { id: b.id, text: `${b.roomCode} booking request for "${b.purpose}" is pending admin approval`, type: 'warning', time: timeAgo(b.createdAt) }
        case 'completed':
          return { id: b.id, text: `${b.roomCode} booking completed — ${b.purpose}`, type: 'success', time: timeAgo(b.createdAt) }
        case 'cancelled':
          return { id: b.id, text: `${b.roomCode} booking for ${d} was cancelled`, type: 'info', time: timeAgo(b.createdAt) }
        default:
          return { id: b.id, text: `${b.roomCode} booking recorded`, type: 'info', time: timeAgo(b.createdAt) }
      }
    })
}

function computeStats(bookings) {
  const today = new Date().toISOString().split('T')[0]
  const rooms = mergeRoomStates(classrooms)

  const activeBookings      = bookings.filter((b) => b.status === 'confirmed' && b.date >= today).length
  const availableClassrooms = rooms.filter((r) => r.status === 'available').length
  const pendingRequests     = bookings.filter((b) => b.status === 'pending').length
  const totalOccupied       = hostels.reduce((s, h) => s + h.occupiedRooms, 0)
  const totalRooms          = hostels.reduce((s, h) => s + h.totalRooms, 0)
  const hostelOccupancy     = totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0

  return [
    {
      label:     'Active Bookings',
      value:     String(activeBookings),
      sub:       pendingRequests > 0 ? `+${pendingRequests} pending` : 'All confirmed',
      icon:      CalendarCheck,
      iconColor: '#0B5D1E',
      iconBg:    '#e8f5e9',
      trend:     activeBookings > 0,
    },
    {
      label:     'Available Classrooms',
      value:     String(availableClassrooms),
      sub:       `Out of ${classrooms.length} total`,
      icon:      BookOpen,
      iconColor: '#1565C0',
      iconBg:    '#e3f2fd',
      trend:     false,
    },
    {
      label:     'Hostel Occupancy',
      value:     `${hostelOccupancy}%`,
      sub:       `${totalRooms - totalOccupied} beds available`,
      icon:      Building2,
      iconColor: '#E65100',
      iconBg:    '#fff3e0',
      trend:     false,
    },
    {
      label:     'Pending Requests',
      value:     String(pendingRequests),
      sub:       pendingRequests === 0 ? 'Nothing awaiting approval' : 'Awaiting admin approval',
      icon:      Clock,
      iconColor: '#6A1B9A',
      iconBg:    '#f3e5f5',
      trend:     false,
    },
  ]
}

function loadBookings() {
  const stored    = getBookings()
  const storedIds = new Set(stored.map((b) => b.id))
  const toAdd     = mockBookings.filter((b) => !storedIds.has(b.id))
  if (toAdd.length > 0) {
    const merged = [...stored, ...toAdd]
    saveBookings(merged)
    return merged
  }
  return stored
}

export default function Dashboard() {
  // Lazy initializer: seeds mock data once, then reads — no effect needed
  const [bookings] = useState(loadBookings)

  const stats    = computeStats(bookings)
  const activity = buildActivityFeed(bookings)
  const user     = getUser()

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Welcome banner */}
      <div
        className="relative rounded-2xl p-6 text-white overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 60%, #6DBE45 100%)' }}
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 bg-white" />
        <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#6DBE45' }} />
        <div className="relative z-10">
          <p className="text-green-200 text-xs font-medium uppercase tracking-wider mb-1">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold">
            Good morning, {user?.name?.split(' ')[0] ?? 'Student'}! 👋
          </h2>
          <p className="text-green-100 text-sm mt-1.5 max-w-md">
            Manage your lecture space bookings and check hostel availability - all in one place.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Link
              to="/classroom"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#6DBE45' }}
            >
              <BookOpen size={15} />
              Book a Space
            </Link>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white/15 hover:bg-white/25 text-white transition-all"
            >
              <CalendarCheck size={15} />
              My Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, iconColor, iconBg, trend }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBg }}
              >
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              {trend && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={10} />
                  Active
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Quick Actions</h3>
          <p className="text-xs text-gray-400 mb-4">Jump to a key task</p>
          <div className="space-y-3">
            {quickActions.map(({ label, description, path, icon: Icon, color, bg }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>
                  </div>
                </div>
                <ArrowRight
                  size={15}
                  className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
            <Link
              to="/bookings"
              className="text-xs font-medium hover:underline"
              style={{ color: '#0B5D1E' }}
            >
              View all
            </Link>
          </div>
          <p className="text-xs text-gray-400 mb-4">Latest updates on your bookings</p>

          {activity.length > 0 ? (
            <div className="space-y-2.5">
              {activity.map(({ id, text, type, time }) => (
                <div
                  key={id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: activityBg[type] }}
                >
                  {activityIcons[type]}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarCheck size={24} className="text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No activity yet.</p>
              <Link to="/classroom" className="text-xs font-medium mt-1 hover:underline" style={{ color: '#0B5D1E' }}>
                Make your first booking
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
