import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, ShieldCheck, Star, Users,
  CheckCircle2, CalendarCheck, X, CalendarDays,
  Flame, Sparkles, BedDouble, BarChart3, Phone, Info,
} from 'lucide-react'
import { Button, Input, Spinner, EmptyState } from '../../components/common'
import {
  HostelGallery,
  RoomOptionCard,
  AvailabilityBadge,
} from '../../components/hostels'
import { schoolHostels } from '../../data/schoolHostels'
import { privateHostels } from '../../data/privateHostels'
import {
  getUser,
  getBookings,
  addBooking,
  addNotification,
} from '../../utils/storage'
import { cn } from '../../utils/cn'

const ALL_HOSTELS = [...schoolHostels, ...privateHostels]

const SESSIONS = ['2025/2026 Session', '2026/2027 Session']

const EMPTY_FORM = { studentName: '', session: '', moveInDate: '' }

const selectClass = (hasError = false) => cn(
  'w-full h-[42px] px-4 rounded-xl border text-sm text-gray-600 outline-none transition-all duration-200',
  hasError
    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
    : 'border-gray-200 bg-gray-50 focus:border-[#0B5D1E] focus:ring-2 focus:ring-[#0B5D1E]/20 focus:bg-white',
)

const categoryConfig = {
  school:  { label: 'School Hostel',  bg: '#e8f5e9', color: '#0B5D1E' },
  private: { label: 'Private Hostel', bg: '#ede7f6', color: '#6a1b9a' },
}

const genderStyles = {
  Female: { bg: '#fce4ec', color: '#ad1457' },
  Male:   { bg: '#e3f2fd', color: '#1565c0' },
  Mixed:  { bg: '#e8f5e9', color: '#0B5D1E' },
}

const genderGradients = {
  Female: 'linear-gradient(135deg, #AD1457 0%, #880E4F 100%)',
  Male:   'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
  Mixed:  'linear-gradient(135deg, #0B5D1E 0%, #1a7a2e 100%)',
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export default function HostelDetails() {
  const { slug }   = useParams()
  const navigate   = useNavigate()

  const [pageLoading, setPageLoading]   = useState(true)
  const [hostel, setHostel]             = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const [modalOpen, setModalOpen]   = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const found = ALL_HOSTELS.find((h) => h.slug === slug)
      setHostel(found ?? null)
      setPageLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [slug])

  useEffect(() => {
    if (!modalOpen) return
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalOpen])

  function openBookingModal(room) {
    const user = getUser()
    setSelectedRoom(room)
    setForm({ ...EMPTY_FORM, studentName: user?.name ?? '' })
    setErrors({})
    setSuccess(false)
    setModalOpen(true)
  }

  function closeModal() {
    if (submitting) return
    setModalOpen(false)
    setSuccess(false)
  }

  function validate() {
    const e = {}
    if (!form.studentName.trim()) e.studentName = 'Student name is required'
    if (!form.session)            e.session     = 'Please select an academic session'
    if (!form.moveInDate)         e.moveInDate  = 'Please select a move-in date'
    const duplicate = getBookings().find(
      (b) =>
        b.type     === 'hostel' &&
        b.roomId   === hostel.id &&
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
      roomId:     hostel.id,
      roomCode:   hostel.code,
      roomName:   hostel.name,
      purpose:    selectedRoom?.type ?? 'Hostel Bed',
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
      message:   `Hostel bed request for ${hostel.name}${selectedRoom ? ` (${selectedRoom.type})` : ''} submitted successfully.`,
    })
    setSuccess(true)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size="lg" centered />
        <p className="text-xs text-gray-400">Loading hostel details…</p>
      </div>
    )
  }

  if (!hostel) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={MapPin}
          title="Hostel not found"
          description="The hostel you're looking for doesn't exist or may have been removed."
          action={
            <Button onClick={() => navigate('/hostel')}>Back to Hostel Listing</Button>
          }
        />
      </div>
    )
  }

  const catConfig    = categoryConfig[hostel.category] ?? categoryConfig.school
  const gStyle       = genderStyles[hostel.gender] ?? genderStyles.Mixed
  const gradient     = genderGradients[hostel.gender] ?? genderGradients.Mixed
  const distance     = hostel.distanceFromCampus ?? hostel.distanceFromGate ?? null
  const isFull       = hostel.status === 'full'
  const isLimited    = hostel.status === 'limited'

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/hostel')}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Hostel Listing
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-xs font-semibold text-gray-700 truncate">{hostel.name}</span>
        {hostel.featured && (
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
            style={{ backgroundColor: '#e8f5e9', color: '#0B5D1E' }}
          >
            <Sparkles size={9} />
            Featured
          </span>
        )}
      </div>

      {/* ── Limited availability banner ── */}
      {isLimited && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 bg-red-50">
          <Flame size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 font-medium">
            <strong>High demand:</strong> Only a few beds remain in this hostel. Book soon to secure your spot.
          </p>
        </div>
      )}

      {/* ── Hero section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gallery — 2 columns */}
        <div className="lg:col-span-2">
          <HostelGallery hostel={hostel} />
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">

          {/* Category + gender + verified badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
              style={{ backgroundColor: catConfig.bg, color: catConfig.color }}
            >
              {catConfig.label}
            </span>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: gStyle.bg, color: gStyle.color }}
            >
              {hostel.gender}
            </span>
            {hostel.verified && (
              <span
                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ backgroundColor: '#e8f5e9', color: '#0B5D1E' }}
              >
                <ShieldCheck size={10} />
                Verified
              </span>
            )}
          </div>

          {/* Name + rating */}
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-snug">{hostel.name}</h1>
            {hostel.rating && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= Math.round(hostel.rating) ? 'text-amber-400' : 'text-gray-200'}
                    fill={s <= Math.round(hostel.rating) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="text-sm font-bold text-gray-700 ml-0.5">{hostel.rating.toFixed(1)}</span>
                {hostel.reviewCount && (
                  <span className="text-xs text-gray-400">({hostel.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MapPin size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
            <div>
              <p className="text-xs">{hostel.location}</p>
              {hostel.address && (
                <p className="text-[11px] text-gray-400 mt-0.5">{hostel.address}</p>
              )}
              {distance && (
                <p className="text-[11px] font-semibold mt-1" style={{ color: '#0B5D1E' }}>
                  {distance} from campus
                </p>
              )}
            </div>
          </div>

          {/* Availability status */}
          <div className="flex items-center justify-between">
            <AvailabilityBadge status={hostel.status} />
            {hostel.totalRooms && (
              <span className="text-[11px] text-gray-400 font-medium">
                {hostel.availableRooms} of {hostel.totalRooms} rooms open
              </span>
            )}
          </div>

          {/* Occupancy bar */}
          {hostel.occupancyRate != null && (
            <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-gray-600">
                  <BarChart3 size={12} />
                  Occupancy
                </span>
                <span
                  className="font-black"
                  style={{ color: hostel.occupancyRate >= 90 ? '#ef4444' : hostel.occupancyRate >= 75 ? '#d97706' : '#16a34a' }}
                >
                  {hostel.occupancyRate}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hostel.occupancyRate}%`,
                    backgroundColor: hostel.occupancyRate >= 90 ? '#ef4444' : hostel.occupancyRate >= 75 ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
            </div>
          )}

          {/* Price range card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Price range</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-gray-800">
                ₦{hostel.priceRange.min.toLocaleString()}
              </span>
              {hostel.priceRange.max !== hostel.priceRange.min && (
                <span className="text-sm font-semibold text-gray-400">
                  – ₦{hostel.priceRange.max.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">per bed · per session</p>
          </div>

          {/* Selected room chip */}
          {selectedRoom && (
            <div
              className="flex items-center gap-2.5 p-3 rounded-xl border-2"
              style={{ borderColor: '#0B5D1E', backgroundColor: '#f0fdf4' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: '#0B5D1E' }}
              >
                <BedDouble size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-gray-700 truncate">{selectedRoom.type}</p>
                <p className="text-[10px]" style={{ color: '#0B5D1E' }}>
                  ₦{selectedRoom.pricePerBed.toLocaleString()}/{selectedRoom.pricePeriod}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* CTA button */}
          {!isFull && (
            <Button
              fullWidth
              icon={CalendarDays}
              onClick={() => openBookingModal(selectedRoom)}
            >
              {selectedRoom ? `Book ${selectedRoom.type}` : 'Request Bed Allocation'}
            </Button>
          )}
          {isFull && (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-red-100 bg-red-50">
              <Info size={13} className="text-red-500 flex-shrink-0" />
              <p className="text-[11px] text-red-600 font-medium">
                This hostel is currently full. Check back later.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Description ── */}
      {hostel.description && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="About this Hostel" />
          <p className="text-sm text-gray-500 leading-relaxed">{hostel.description}</p>
          {hostel.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {hostel.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Room Options ── */}
      <section>
        <SectionHeader
          title="Available Room Types"
          subtitle="Select a room type to pre-fill your booking request"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostel.roomOptions.map((room) => (
            <RoomOptionCard
              key={room.id}
              roomOption={room}
              hostelGender={hostel.gender}
              selected={selectedRoom?.id === room.id}
              onSelect={(r) => {
                setSelectedRoom(r)
                openBookingModal(r)
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Amenities ── */}
      {hostel.amenities?.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader
            title="Amenities"
            subtitle={`${hostel.amenities.length} facilities included`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hostel.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: '#e8f5e9' }}
                >
                  <CheckCircle2 size={13} style={{ color: '#0B5D1E' }} />
                </span>
                <span className="text-xs text-gray-600 font-medium">{a}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact / Enquiry (private hostels) ── */}
      {hostel.contact && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="Contact & Enquiries" />
          <div className="flex flex-wrap gap-4">
            {hostel.contact.phone && (
              <a
                href={`tel:${hostel.contact.phone}`}
                className="flex items-center gap-2 text-xs font-semibold hover:underline"
                style={{ color: '#0B5D1E' }}
              >
                <Phone size={13} />
                {hostel.contact.phone}
              </a>
            )}
            {hostel.contact.name && (
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <Users size={13} className="text-gray-400" />
                Contact: {hostel.contact.name}
              </span>
            )}
          </div>
        </section>
      )}

      {/* ── House Rules (private hostels) ── */}
      {hostel.rules?.length > 0 && (
        <section className="rounded-2xl border border-amber-100 p-5" style={{ backgroundColor: '#fffbeb' }}>
          <SectionHeader title="House Rules" />
          <ul className="space-y-2">
            {hostel.rules.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-xs text-amber-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Booking CTA banner ── */}
      {!isFull && (
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden relative"
          style={{ background: gradient }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full opacity-10 bg-white pointer-events-none" />

          <div className="relative z-10">
            <p className="text-white font-bold text-base leading-snug">
              {selectedRoom
                ? `Ready to book your ${selectedRoom.type}?`
                : 'Ready to secure your bed?'}
            </p>
            <p className="text-white/70 text-xs mt-1 leading-relaxed">
              {selectedRoom
                ? `₦${selectedRoom.pricePerBed.toLocaleString()} per session · Submit your request below`
                : 'Select a room type above or proceed with a general bed request.'}
            </p>
          </div>

          <Button
            variant="secondary"
            icon={CalendarCheck}
            onClick={() => openBookingModal(selectedRoom)}
            className="flex-shrink-0 relative z-10"
          >
            {selectedRoom ? 'Confirm & Book' : 'Request Bed Allocation'}
          </Button>
        </div>
      )}

      {/* ── Booking modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div className="min-w-0 pr-3">
                <h2 className="text-base font-bold text-gray-800 leading-snug">
                  {success ? 'Booking Submitted!' : 'Request Bed Allocation'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {success
                    ? 'Your request is pending approval.'
                    : `${hostel.name}${selectedRoom ? ` · ${selectedRoom.type}` : ''}`}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Success screen */}
            {success ? (
              <div className="p-6 flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#e8f5e9' }}
                >
                  <CheckCircle2 size={32} style={{ color: '#0B5D1E' }} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Request Submitted</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-1">
                  Your bed allocation request for{' '}
                  <strong className="text-gray-700">{hostel.name}</strong>
                  {selectedRoom && <> ({selectedRoom.type})</>} with move-in on{' '}
                  <strong className="text-gray-700">
                    {new Date(form.moveInDate + 'T00:00:00').toLocaleDateString('en-NG', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </strong>{' '}
                  has been submitted.
                </p>
                <p className="text-[11px] text-gray-400 mb-6">
                  You will be notified once the hostel admin processes your request.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" fullWidth onClick={closeModal}>
                    Close
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
              <form onSubmit={handleSubmit} className="p-5 space-y-4">

                {/* Room summary chip */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xs"
                    style={{ background: gradient }}
                  >
                    {hostel.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">{hostel.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {selectedRoom ? selectedRoom.type : 'No room type selected'}
                      {selectedRoom && ` · ₦${selectedRoom.pricePerBed.toLocaleString()}/session`}
                    </p>
                  </div>
                  <AvailabilityBadge status={hostel.status} />
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
                      <p className="text-red-500 text-[11px]">{errors.session}</p>
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

                {/* Duplicate error */}
                {errors.duplicate && (
                  <div className="p-3 rounded-xl border border-red-100 bg-red-50">
                    <p className="text-red-600 text-xs leading-snug">{errors.duplicate}</p>
                  </div>
                )}

                {/* No room selected hint */}
                {!selectedRoom && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                    Tip: Select a room type from the listing for a more specific request.
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" fullWidth disabled={submitting} onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth icon={CalendarDays} loading={submitting}>
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
