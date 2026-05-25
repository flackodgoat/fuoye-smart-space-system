import { Users, Database, BookOpen, Info } from 'lucide-react'
import { getBookings } from '../../utils/storage'

export default function AdminStudents() {
  const bookings   = getBookings()
  const matrics    = [...new Set(bookings.map((b) => b.userMatric).filter(Boolean))]
  const hostelBks  = bookings.filter((b) => b.type === 'hostel').length
  const classBks   = bookings.filter((b) => b.type === 'classroom').length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-xl font-bold text-gray-800">Students</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Student accounts derived from booking activity
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border border-blue-100 bg-blue-50">
        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-blue-800">Backend Integration Pending</p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            Full student records will be pulled from the FUOYE student database once the backend API is connected.
            Currently showing students derived from booking activity in localStorage.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Unique Students (from bookings)', value: matrics.length, icon: Users,   color: '#0B5D1E', bg: '#e8f5e9' },
          { label: 'Hostel Bookings',                 value: hostelBks,      icon: Database, color: '#6a1b9a', bg: '#ede7f6' },
          { label: 'Classroom Bookings',               value: classBks,       icon: BookOpen, color: '#1565c0', bg: '#e3f2fd' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student list from bookings */}
      {matrics.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Students with Booking Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {matrics.map((matric) => {
              const studentBookings = bookings.filter((b) => b.userMatric === matric)
              return (
                <div key={matric} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#0B5D1E' }}
                  >
                    {matric.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-semibold text-gray-800">{matric}</p>
                    <p className="text-[10px] text-gray-400">
                      {studentBookings.length} booking{studentBookings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['hostel', 'classroom'].map((type) => {
                      const count = studentBookings.filter((b) => b.type === type).length
                      return count > 0 ? (
                        <span
                          key={type}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={type === 'hostel'
                            ? { backgroundColor: '#e8f5e9', color: '#0B5D1E' }
                            : { backgroundColor: '#e3f2fd', color: '#1565c0' }}
                        >
                          {count} {type}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {matrics.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Users size={32} className="text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No student activity yet</p>
          <p className="text-xs text-gray-300 mt-1">Student data will appear here once they make bookings</p>
        </div>
      )}
    </div>
  )
}
