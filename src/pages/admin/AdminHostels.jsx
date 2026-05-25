import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Search, ShieldCheck, Users, BarChart3,
  CheckCircle2, AlertCircle, XCircle, Eye,
} from 'lucide-react'
import { schoolHostels, schoolHostelStats } from '../../data/schoolHostels'
import { privateHostels, privateHostelStats } from '../../data/privateHostels'

const allHostels = [...schoolHostels, ...privateHostels]

const STATUS_CFG = {
  available: { label: 'Available', dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  limited:   { label: 'Limited',   dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  full:      { label: 'Full',      dot: 'bg-red-500',   badge: 'bg-red-50 text-red-600' },
}

function StatusChip({ status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.full
  return (
    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function OccupancyBar({ rate }) {
  const color = rate >= 90 ? '#ef4444' : rate >= 75 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${rate}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>{rate}%</span>
    </div>
  )
}

export default function AdminHostels() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const displayed = useMemo(() => {
    const q = search.toLowerCase()
    return allHostels.filter((h) => {
      const matchTab = tab === 'all' || h.category === tab
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.code.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [tab, search])

  const tabs = [
    { label: 'All Hostels', value: 'all',     count: allHostels.length },
    { label: 'School',      value: 'school',  count: schoolHostels.length },
    { label: 'Private',     value: 'private', count: privateHostels.length },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hostel Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {allHostels.length} hostels · {schoolHostelStats.availableRooms + privateHostelStats.available} beds available
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#0B5D1E' }}
        >
          <Building2 size={15} />
          Add Hostel
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Available',    value: allHostels.filter((h) => h.status === 'available').length, icon: CheckCircle2, color: '#0B5D1E', bg: '#e8f5e9' },
          { label: 'Limited',      value: allHostels.filter((h) => h.status === 'limited').length,   icon: AlertCircle,  color: '#b45309', bg: '#fffbeb' },
          { label: 'Full',         value: allHostels.filter((h) => h.status === 'full').length,      icon: XCircle,      color: '#dc2626', bg: '#fef2f2' },
          { label: 'Total Rooms',  value: allHostels.reduce((s, h) => s + h.totalRooms, 0),          icon: Users,        color: '#1565c0', bg: '#e3f2fd' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-black text-gray-800 leading-none">{value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map(({ label, value, count }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  tab === value
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                ].join(' ')}
                style={tab === value ? { backgroundColor: '#0B5D1E' } : {}}
              >
                {label}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={tab === value
                    ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 sm:ml-auto sm:w-56">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hostels…"
              className="flex-1 text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Hostel', 'Category', 'Gender', 'Status', 'Occupancy', 'Avail. Rooms', 'Price From', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map((hostel) => (
                <tr key={hostel.id} className="hover:bg-gray-50 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                        style={{
                          background: hostel.gender === 'Female'
                            ? 'linear-gradient(135deg,#AD1457,#880E4F)'
                            : hostel.gender === 'Male'
                            ? 'linear-gradient(135deg,#1565C0,#0D47A1)'
                            : 'linear-gradient(135deg,#0B5D1E,#1a7a2e)',
                        }}
                      >
                        {hostel.code}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">{hostel.name}</p>
                        {hostel.verified && (
                          <p className="flex items-center gap-0.5 text-[10px]" style={{ color: '#0B5D1E' }}>
                            <ShieldCheck size={9} /> Verified
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={hostel.category === 'school'
                        ? { backgroundColor: '#e8f5e9', color: '#0B5D1E' }
                        : { backgroundColor: '#ede7f6', color: '#6a1b9a' }}
                    >
                      {hostel.category}
                    </span>
                  </td>
                  {/* Gender */}
                  <td className="px-4 py-3.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={hostel.gender === 'Female'
                        ? { backgroundColor: '#fce4ec', color: '#ad1457' }
                        : hostel.gender === 'Male'
                        ? { backgroundColor: '#e3f2fd', color: '#1565c0' }
                        : { backgroundColor: '#e8f5e9', color: '#0B5D1E' }}
                    >
                      {hostel.gender}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5"><StatusChip status={hostel.status} /></td>
                  {/* Occupancy */}
                  <td className="px-4 py-3.5 min-w-[120px]">
                    <OccupancyBar rate={hostel.occupancyRate} />
                  </td>
                  {/* Available rooms */}
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-bold text-gray-800">{hostel.availableRooms}</p>
                    <p className="text-[10px] text-gray-400">of {hostel.totalRooms}</p>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-bold text-gray-800">₦{hostel.priceRange.min.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">/session</p>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/hostel/${hostel.slug}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Eye size={11} /> View
                      </button>
                      <button
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-colors"
                        style={{ backgroundColor: '#0B5D1E' }}
                      >
                        <BarChart3 size={11} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No hostels match your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
