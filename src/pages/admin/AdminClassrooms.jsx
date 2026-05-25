import { useState } from 'react'
import { BookOpen, Search, Users, CheckCircle2, XCircle } from 'lucide-react'
import { classrooms } from '../../data/classrooms'

export default function AdminClassrooms() {
  const [search, setSearch] = useState('')

  const displayed = classrooms.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  )

  const available = classrooms.filter((c) => c.status === 'available').length

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Classroom Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {classrooms.length} classrooms · {available} available
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#0B5D1E' }}
        >
          <BookOpen size={15} />
          Add Classroom
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: classrooms.length,                                          color: '#0B5D1E', bg: '#e8f5e9' },
          { label: 'Available',    value: available,                                                   color: '#0B5D1E', bg: '#e8f5e9' },
          { label: 'Occupied',     value: classrooms.filter((c) => c.status === 'occupied').length,   color: '#b45309', bg: '#fffbeb' },
          { label: 'Total Seats',  value: classrooms.reduce((s, c) => s + c.capacity, 0),            color: '#1565c0', bg: '#e3f2fd' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xl font-black text-gray-800">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 flex-1 max-w-xs">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classrooms…"
              className="flex-1 text-xs bg-transparent outline-none placeholder:text-gray-400 text-gray-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Code', 'Name', 'Faculty / Building', 'Capacity', 'Features', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono font-bold text-gray-700">{room.code}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-gray-800">{room.name}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600">{room.faculty}</p>
                    <p className="text-[10px] text-gray-400">{room.building}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-700">{room.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {room.features?.slice(0, 2).map((f) => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{f}</span>
                      ))}
                      {room.features?.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">+{room.features.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                      style={room.status === 'available'
                        ? { backgroundColor: '#e8f5e9', color: '#0B5D1E' }
                        : { backgroundColor: '#fef2f2', color: '#dc2626' }}
                    >
                      {room.status === 'available' ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                      {room.status === 'available' ? 'Available' : 'Occupied'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
