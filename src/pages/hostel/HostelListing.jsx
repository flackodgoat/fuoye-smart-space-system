import { useState, useMemo } from 'react'
import { Building2, Home, Sparkles, TrendingUp } from 'lucide-react'
import { EmptyState, Button } from '../../components/common'
import {
  HostelCard,
  FeaturedHostelCard,
  HostelTabs,
  HostelFilters,
} from '../../components/hostels'
import { schoolHostels, schoolHostelStats } from '../../data/schoolHostels'
import { privateHostels, privateHostelStats } from '../../data/privateHostels'

// ── Filter helpers ──────────────────────────────────────────────────────────
const PRICE_RANGES = {
  all:     null,
  budget:  [0,      20000],
  mid:     [20000,  50000],
  premium: [50000,  Infinity],
}

const DISTANCE_MINUTES = {
  all:     Infinity,
  '10min': 10,
  '20min': 20,
}

function extractMinutes(distanceStr) {
  if (!distanceStr) return Infinity
  const match = distanceStr.match(/(\d+)/)
  return match ? Number(match[1]) : Infinity
}

const DEFAULT_FILTERS = { gender: 'all', status: 'all', price: 'all', distance: 'all' }
const allHostels      = [...schoolHostels, ...privateHostels]

// ── Summary stat chip ───────────────────────────────────────────────────────
function StatChip({ icon: Icon, label, color }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
      <Icon size={12} />
      {label}
    </span>
  )
}

export default function HostelListing() {
  const [activeTab, setActiveTab] = useState('school')
  const [search, setSearch]       = useState('')
  const [filters, setFilters]     = useState(DEFAULT_FILTERS)

  const baseList = activeTab === 'school' ? schoolHostels : privateHostels

  // Featured: from both categories, show at most 4
  const featuredHostels = useMemo(
    () => allHostels.filter((h) => h.featured).slice(0, 4),
    [],
  )

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return baseList.filter((h) => {
      const matchSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.code.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.tags?.some((t) => t.toLowerCase().includes(q))

      const matchGender = filters.gender === 'all' || h.gender === filters.gender
      const matchStatus = filters.status === 'all' || h.status === filters.status

      const priceRange  = PRICE_RANGES[filters.price]
      const matchPrice  =
        !priceRange ||
        (h.priceRange.min >= priceRange[0] && h.priceRange.min <= priceRange[1])

      const maxMinutes  = DISTANCE_MINUTES[filters.distance]
      const distStr     = h.distanceFromCampus ?? h.distanceFromGate ?? ''
      const matchDist   = maxMinutes === Infinity || extractMinutes(distStr) <= maxMinutes

      return matchSearch && matchGender && matchStatus && matchPrice && matchDist
    })
  }, [baseList, search, filters])

  const hasActiveFilters =
    search ||
    filters.gender   !== 'all' ||
    filters.status   !== 'all' ||
    filters.price    !== 'all' ||
    filters.distance !== 'all'

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setSearch('')
    setFilters(DEFAULT_FILTERS)
  }

  const tabCounts = { school: schoolHostels.length, private: privateHostels.length }

  // ── Page ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-7 max-w-6xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hostel Accommodation</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Browse on-campus and verified private hostels near FUOYE
          </p>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <StatChip icon={Building2}   label={`${schoolHostelStats.available} school available`}   color="#0B5D1E" />
          <StatChip icon={Home}        label={`${privateHostelStats.available} private available`}  color="#6a1b9a" />
          <StatChip icon={TrendingUp}  label={`${schoolHostelStats.availableRooms} beds free`}     color="#1565c0" />
        </div>
      </div>

      {/* ── Featured section ── */}
      {featuredHostels.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#e8f5e9' }}
            >
              <Sparkles size={13} style={{ color: '#0B5D1E' }} />
            </div>
            <h2 className="text-sm font-bold text-gray-700">Featured Hostels</h2>
            <span className="text-[11px] text-gray-400 font-medium">
              — handpicked for quality and proximity
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {featuredHostels.map((h) => (
              <FeaturedHostelCard key={h.id} hostel={h} />
            ))}
          </div>
        </section>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Browse All</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* ── Tab bar ── */}
      <HostelTabs activeTab={activeTab} onChange={setActiveTab} counts={tabCounts} />

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <HostelFilters
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          activeTab={activeTab}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          Showing{' '}
          <span className="text-gray-700 font-bold">{filtered.length}</span>
          {' '}of{' '}
          <span className="text-gray-700 font-bold">{baseList.length}</span>
          {' '}{activeTab === 'school' ? 'school' : 'private'} hostels
          {hasActiveFilters && ' matching your filters'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[11px] font-semibold hover:underline"
            style={{ color: '#0B5D1E' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid / empty state ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-4">
          {filtered.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyState
            icon={activeTab === 'school' ? Building2 : Home}
            title="No hostels found"
            description="No hostels match your current filters. Try adjusting your search or clearing the filters."
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
    </div>
  )
}
