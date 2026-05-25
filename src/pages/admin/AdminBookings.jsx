import { useState, useMemo } from 'react'
import {
  CalendarCheck, Building2, BookOpen, CheckCircle2, XCircle,
  Clock, Search, Filter,
} from 'lucide-react'
import { getBookings, approveBooking, rejectBooking } from '../../utils/storage'
import { cn } from '../../utils/cn'

const STATUS_CFG = {
  pending:   { label: 'Pending',   bg: '#fffbeb', color: '#b45309', icon: Clock },
  confirmed: { label: 'Confirmed', bg: '#e8f5e9', color: '#0B5D1E', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', bg: '#fef2f2', color: '#dc2626', icon: XCircle },
  rejected:  { label: 'Rejected',  bg: '#fef2f2', color: '#dc2626', icon: XCircle },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      <Icon size={9} />
      {cfg.label}
    </span>
  )
}

const FILTER_TABS = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Rejected',  value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function AdminBookings() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch]             = useState('')
  const [bookings, setBookings]         = useState(() => getBookings())

  const refresh = () => setBookings(getBookings())

  function handleApprove(id) {
    approveBooking(id)
    refresh()
  }

  function handleReject(id) {
    rejectBooking(id)
    refresh()
  }

  const displayed = useMemo(() => {
    const q = search.toLowerCase()
    return bookings.filter((b) => {
      const matchStatus = filterStatus === 'all' || b.status === filterStatus
      const matchSearch = !q ||
        b.roomName?.toLowerCase().includes(q) ||
        b.userMatric?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [bookings, filterStatus, search])

  const pending = bookings.filter((b) => b.status === 'pending').length

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Booking Requests</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {bookings.length} total · {pending} pending approval
          </p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-100 bg-amber-50">
            <Clock size={13} className="text-amber-600" />
            <p className="text-xs text-amber-700 font-semibold">{pending} request{pending > 1 ? 's' : ''} awaiting review</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_TABS.map(({ label, value }) => {
            const count = value === 'all' ? bookings.length : bookings.filter((b) => b.status === value).length
            return (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  filterStatus === value ? 'text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                ].join(' ')}
                style={filterStatus === value ? { backgroundColor: '#0B5D1E' } : {}}
              >
                {label}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={filterStatus === value
                    ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 sm:ml-auto sm:w-56">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by matric, name…"
            className="flex-1 text-xs bg-transparent outline-none placeholder:text-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Booking ID', 'Student', 'Type', 'Room / Hall', 'Date', 'Session', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  {/* ID */}
                  <td className="px-4 py-3.5">
                    <p className="text-[11px] font-mono text-gray-500">{b.id}</p>
                  </td>
                  {/* Student */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-gray-800">{b.userMatric ?? 'N/A'}</p>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: b.type === 'hostel' ? '#e8f5e9' : '#e3f2fd' }}
                      >
                        {b.type === 'hostel'
                          ? <Building2 size={11} style={{ color: '#0B5D1E' }} />
                          : <BookOpen   size={11} style={{ color: '#1565c0' }} />}
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 capitalize">{b.type}</span>
                    </div>
                  </td>
                  {/* Room */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">{b.roomName}</p>
                    <p className="text-[10px] text-gray-400">{b.purpose}</p>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600">{b.date || '—'}</p>
                    {b.startTime && <p className="text-[10px] text-gray-400">{b.startTime}</p>}
                  </td>
                  {/* Session / Duration */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600 whitespace-nowrap">{b.duration || '—'}</p>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    {b.status === 'pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors"
                          style={{ backgroundColor: '#0B5D1E' }}
                        >
                          <CheckCircle2 size={11} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(b.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={11} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarCheck size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">
              {bookings.length === 0 ? 'No booking requests yet' : 'No bookings match your filter'}
            </p>
            <p className="text-[11px] text-gray-300 mt-0.5">
              {bookings.length === 0 ? 'Student bookings will appear here for approval' : 'Try changing the filter'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
