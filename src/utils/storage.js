// ── Key registry ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER: 'fuoye_user',
  USERS: 'fuoye_users',
  BOOKINGS: 'fuoye_bookings',
  ROOM_STATES: 'fuoye_room_states',
  NOTIFICATIONS: 'fuoye_notifications',
  SETTINGS: 'fuoye_settings',
}

// ── Internal read/write helpers ──────────────────────────────────────────────
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // noop
  }
}

// ── User Session ─────────────────────────────────────────────────────────────
export const getUser = () => read(STORAGE_KEYS.USER, null)

export function saveUser(user) {
  write(STORAGE_KEYS.USER, user)
  window.dispatchEvent(new Event('fuoye_user_updated'))
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
  window.dispatchEvent(new Event('fuoye_user_updated'))
}

// ── Registered Users Database ────────────────────────────────────────────────
export const getUsers = () => read(STORAGE_KEYS.USERS, [])

export const saveUsers = (users) => {
  write(STORAGE_KEYS.USERS, users)
}

// ── Bookings ─────────────────────────────────────────────────────────────────
export const getBookings = () => read(STORAGE_KEYS.BOOKINGS, [])

export const saveBookings = (list) =>
  write(STORAGE_KEYS.BOOKINGS, list)

export const addBooking = (booking) =>
  saveBookings([booking, ...getBookings()])

export const cancelBooking = (id) =>
  saveBookings(
    getBookings().map((booking) =>
      booking.id === id
        ? {
            ...booking,
            status: 'cancelled',
            updatedAt: new Date().toISOString(),
          }
        : booking
    )
  )

export const updateBookingStatus = (id, status) =>
  saveBookings(
    getBookings().map((booking) =>
      booking.id === id
        ? {
            ...booking,
            status,
            updatedAt: new Date().toISOString(),
          }
        : booking
    )
  )

export const approveBooking = (id) =>
  updateBookingStatus(id, 'confirmed')

export const rejectBooking = (id) =>
  updateBookingStatus(id, 'rejected')

// ── Room states ──────────────────────────────────────────────────────────────
export const getRoomStates = () =>
  read(STORAGE_KEYS.ROOM_STATES, {})

export function setRoomState(roomId, patch) {
  write(STORAGE_KEYS.ROOM_STATES, {
    ...getRoomStates(),
    [roomId]: patch,
  })
}

export function mergeRoomStates(baseRooms) {
  const states = getRoomStates()

  return baseRooms.map((room) =>
    states[room.id]
      ? { ...room, ...states[room.id] }
      : room
  )
}

// ── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = () =>
  read(STORAGE_KEYS.NOTIFICATIONS, [])

export function addNotification(notification) {
  const list = [
    {
      ...notification,
      id: `N-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    },
    ...getNotifications(),
  ]

  write(STORAGE_KEYS.NOTIFICATIONS, list)

  window.dispatchEvent(
    new Event('fuoye_notifications_updated')
  )
}

export function markAllNotificationsRead() {
  write(
    STORAGE_KEYS.NOTIFICATIONS,
    getNotifications().map((notification) => ({
      ...notification,
      read: true,
    }))
  )

  window.dispatchEvent(
    new Event('fuoye_notifications_updated')
  )
}

export const getUnreadCount = () =>
  getNotifications().filter((n) => !n.read).length

// ── Settings ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  emailNotifications: true,
  bookingReminders: true,
  systemAlerts: true,
}

export const getSettings = () =>
  read(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)

export const saveSettings = (settings) =>
  write(STORAGE_KEYS.SETTINGS, settings)

// ── Shared utilities ─────────────────────────────────────────────────────────
export function timeAgo(isoStr) {
  if (!isoStr) return ''

  const ms = Date.now() - new Date(isoStr).getTime()

  const mins = Math.floor(ms / 60000)
  const hours = Math.floor(ms / 3600000)
  const days = Math.floor(ms / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return new Date(isoStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatDate(dateStr) {
  if (!dateStr) return ''

  return new Date(dateStr + 'T00:00:00').toLocaleDateString(
    'en-NG',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
}