import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Building2,
  X,
  CalendarDays,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react'
import { Button, Input, Card, EmptyState, Spinner, Badge } from '../../components/common'
import HostelCard from '../../components/cards/HostelCard'
import { hostels as hostelData } from '../../data/hostels'
import {
  getUser,
  getBookings,
  addBooking,
  addNotification,
  formatDate,
} from '../../utils/storage'
import { cn } from '../../utils/cn'

const GENDER_FILTERS = [
  { label: 'All',    value: 'all' },
  { label: 'Female', value: 'Female' },
  { label: 'Male',   value: 'Male' },
]

const STATUS_FILTERS = [
  { label: 'All Hostels', value: 'all' },
  { label: 'Available',   value: 'available' },
  { label: 'Full',        value: 'full' },
]

const SESSIONS = ['2025/2026 Session', '2026/2027 Session']

const EMPTY_FORM = { studentName: '', roomType: '', session: '', moveInDate: '' }

const selectClass = (hasError = false) => cn(
  'w-full h-[42px] px-4 rounded-xl border text-sm text-gray-600 outline-none transition-all duration-200',
  hasError
    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
    : 'border-gray-200 bg-gray-50 focus:border-[#0B5D1E] focus:ring-2 focus:ring-[#0B5D1E]/20 focus:bg-white',
)

const chipClass = (active) => cn(
  'px-3 py-1 rounded-full text-[11px] font-semibold transition-all border',
  active
    ? 'text-white border-transparent'
    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
)

export default function HostelBooking() {
  const navigate = useNavigate()

  const [pageLoading, setPageLoading]   = useState(true)
  const [hostels, setHostels]           = useState([])
  const [search, setSearch]             = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modal state
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [form, setForm]                     = useState(EMPTY_FORM)
  const [errors, setErrors]                 = useState({})
  const [submitting, setSubmitting]         = useState(false)
  const [success, setSuccess]               = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setHostels(hostelData)
      setPageLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  // Escape key closes modal
  useEffect(() => {
    if (!selectedHostel) return
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedHostel])

  // Derived counts
  const availableCount  = hostels.filter((h) => h.status === 'available').length
  const fullCount       = hostels.filter((h) => h.status === 'full').length
  const totalAvailBeds  = hostels.reduce((sum, h) => sum + h.availableRooms, 0)

  const filtered = hostels.filter((h) => {
    const q = search.toLowerCase()
    const matchSearch =
      h.code.toLowerCase().includes(q) ||
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.gender.toLowerCase().includes(q)
    const matchGender = genderFilter === 'all' || h.gender === genderFilter
    const matchStatus = statusFilter === 'all' || h.status === statusFilter
    return matchSearch && matchGender && matchStatus
  })

  const hasActiveFilters = search || genderFilter !== 'all' || statusFilter !== 'all'

  function clearFilters() {
    setSearch('')
    setGenderFilter('all')
    setStatusFilter('all')
  }

  function openModal(hostel) {
    const user = getUser()
    setSelectedHostel(hostel)
    setForm({ ...EMPTY_FORM, studentName: user?.name ?? '' })
    setErrors({})
    setSuccess(false)
  }

  function closeModal() {
    if (submitting) return
    setSelectedHostel(null)
    setSuccess(false)
  }

  function validate() {
    const e = {}
    if (!form.studentName.trim()) e.studentName = 'Student name is required'
    if (!form.roomType)           e.roomType    = 'Please select a room type'
    if (!form.session)            e.session     = 'Please select an academic session'
    if (!form.moveInDate)         e.moveInDate  = 'Please select a move-in date'
    // Duplicate: same hostel + same session already pending/confirmed
    const duplicate = getBookings().find(
      (b) =>
        b.type     === 'hostel' &&
        b.roomId   === selectedHostel.id &&
        b.duration === form.session &&
        (b.status === 'pending' || b.status === 'confirmed'),
    )
    if (duplicate) e.duplicate = 'You already have an active hostel booking for this session.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    await new Promise((res) => setTimeout(res, 1200))
    setSubmitting(false)

    const user    = getUser()
    const booking = {
      id:         `BK-${Date.now()}`,
      type:       'hostel',
      roomId:     selectedHostel.id,
      roomCode:   selectedHostel.code,
      roomName:   selectedHostel.name,
      purpose:    form.roomType,
      date:       form.moveInDate,
      startTime:  '',
      duration:   form.session,
      attendees:  null,
      status:     'pending',
      createdAt:  new Date().toISOString(),
      userMatric: user?.matricNumber ?? 'Unknown',
    }
    addBooking(booking)
    addNotification({
      type:      'booking_created',
      bookingId: booking.id,
      message:   `Hostel bed request for ${selectedHostel.name} (${form.roomType}) submitted successfully.`,
    })
    setSuccess(true)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size="lg" centered />
        <p className="text-xs text-gray-400">Loading hostel information…</p>
      </div>
    )
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hostel Booking</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View hostel occupancy and submit bed allocation requests
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            {availableCount} Available
          </span>
          <span className="flex items-center gap-1.5 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            {fullCount} Full
          </span>
          <span className="flex items-center gap-1.5 text-blue-600">
            <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
            {totalAvailBeds} Beds Free
          </span>
        </div>
      </div>

      {/* Search + filters */}
      <Card noPadding bodyClassName="p-4 space-y-3">
        <Input
          placeholder="Search by hostel name, code, or location…"
          leftIcon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter chips — gender + status in one row */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={13} className="text-gray-400 flex-shrink-0" />
          {GENDER_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setGenderFilter(value)}
              className={chipClass(genderFilter === value)}
              style={genderFilter === value ? { backgroundColor: '#0B5D1E', borderColor: '#0B5D1E' } : {}}
            >
              {label}
            </button>
          ))}
          <div className="h-4 w-px bg-gray-200 flex-shrink-0" />
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={chipClass(statusFilter === value)}
              style={statusFilter === value ? { backgroundColor: '#0B5D1E', borderColor: '#0B5D1E' } : {}}
            >
              {label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={11} />
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Results count */}
      <p className="text-xs text-gray-400 font-medium px-0.5">
        Showing{' '}
        <span className="text-gray-600 font-semibold">{filtered.length}</span>
        {' '}of{' '}
        <span className="text-gray-600 font-semibold">{hostels.length}</span>
        {' '}hostels
        {hasActiveFilters && ' matching your filters'}
      </p>

      {/* Hostel grid / empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} onBook={openModal} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <EmptyState
            icon={Building2}
            title="No hostels found"
            description="No hostels match your current filters. Try adjusting the search or clearing the filters."
            action={
              hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              ) : null
            }
          />
        </div>
      )}

      {/* ── Booking modal ── */}
      {selectedHostel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div className="min-w-0 pr-3">
                <h2 className="text-base font-bold text-gray-800 leading-snug">
                  {success ? 'Booking Submitted!' : `Book a Bed — ${selectedHostel.name}`}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {success
                    ? 'Your request is pending hostel admin approval.'
                    : `${selectedHostel.gender} Hostel · ${selectedHostel.location}`}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Success state ── */}
            {success ? (
              <div className="p-5 flex flex-col items-center text-center py-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#e8f5e9' }}
                >
                  <CheckCircle2 size={32} style={{ color: '#0B5D1E' }} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Request Submitted</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-1">
                  Your bed allocation request for{' '}
                  <strong className="text-gray-600">{selectedHostel.name}</strong>
                  {' '}({form.roomType}) with move-in on{' '}
                  <strong className="text-gray-600">
                    {new Date(form.moveInDate + 'T00:00:00').toLocaleDateString('en-NG', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </strong>{' '}
                  has been submitted.
                </p>
                <p className="text-[10px] text-gray-400 mb-6">
                  You will be notified once the hostel admin processes your request.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" fullWidth onClick={closeModal}>
                    Book Another
                  </Button>
                  <Button
                    fullWidth
                    icon={CalendarCheck}
                    onClick={() => { closeModal(); navigate('/bookings') }}
                  >
                    View Bookings
                  </Button>
                </div>
              </div>
            ) : (
              /* ── Booking form ── */
              <form onSubmit={handleSubmit} className="p-5 space-y-4">

                {/* Hostel summary chip */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xs"
                    style={{
                      background: selectedHostel.gender === 'Female'
                        ? 'linear-gradient(135deg, #AD1457 0%, #880E4F 100%)'
                        : 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                    }}
                  >
                    {selectedHostel.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {selectedHostel.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {selectedHostel.location} · {selectedHostel.availableRooms} rooms free
                    </p>
                  </div>
                  <Badge variant="success" dot>Available</Badge>
                </div>

                {/* Student name */}
                <Input
                  label="Student Name"
                  placeholder="Your full name"
                  required
                  value={form.studentName}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, studentName: e.target.value }))
                    if (errors.studentName) setErrors((er) => ({ ...er, studentName: undefined }))
                  }}
                  error={errors.studentName}
                />

                {/* Room type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 select-none">
                    Room Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.roomType}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, roomType: e.target.value }))
                      if (errors.roomType) setErrors((er) => ({ ...er, roomType: undefined }))
                    }}
                    className={selectClass(!!errors.roomType)}
                  >
                    <option value="">Select room type…</option>
                    {selectedHostel.roomTypes.map((rt) => (
                      <option key={rt.type} value={rt.type} disabled={rt.available === 0}>
                        {rt.type} — ₦{rt.pricePerBed.toLocaleString()}/bed
                        {rt.available === 0
                          ? ' (Full)'
                          : ` (${rt.available} available)`}
                      </option>
                    ))}
                  </select>
                  {errors.roomType && (
                    <p className="text-red-500 text-[11px] leading-snug">{errors.roomType}</p>
                  )}
                </div>

                {/* Session + move-in date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 select-none">
                      Academic Session <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.session}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, session: e.target.value }))
                        if (errors.session) setErrors((er) => ({ ...er, session: undefined }))
                      }}
                      className={selectClass(!!errors.session)}
                    >
                      <option value="">Select session…</option>
                      {SESSIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.session && (
                      <p className="text-red-500 text-[11px] leading-snug">{errors.session}</p>
                    )}
                  </div>
                  <Input
                    label="Move-in Date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.moveInDate}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, moveInDate: e.target.value }))
                      if (errors.moveInDate) setErrors((er) => ({ ...er, moveInDate: undefined }))
                    }}
                    error={errors.moveInDate}
                  />
                </div>

                {/* Duplicate booking error */}
                {errors.duplicate && (
                  <div className="p-3 rounded-xl border border-red-100 bg-red-50">
                    <p className="text-red-600 text-xs leading-snug">{errors.duplicate}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    disabled={submitting}
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    icon={CalendarDays}
                    loading={submitting}
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
