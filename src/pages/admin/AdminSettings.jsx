import { useState } from 'react'
import { Settings, ShieldCheck, Bell, Database, Save } from 'lucide-react'

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: 'Access & Security',
    settings: [
      { label: 'Two-factor authentication',    desc: 'Require 2FA for all admin logins',                   key: 'twofa',    default: false },
      { label: 'Session timeout (30 min)',      desc: 'Auto-logout inactive admin sessions',                key: 'timeout',  default: true },
      { label: 'Admin activity log',            desc: 'Log all admin actions for auditing',                 key: 'auditLog', default: true },
    ],
  },
  {
    icon: Bell,
    title: 'Notifications',
    settings: [
      { label: 'Email on new booking',          desc: 'Send email when students submit booking requests',    key: 'emailNew',     default: true },
      { label: 'Email on cancellation',         desc: 'Send email when a student cancels a booking',        key: 'emailCancel',  default: false },
      { label: 'Daily summary report',          desc: 'Receive a daily bookings summary at 8:00 AM',        key: 'dailySummary', default: false },
    ],
  },
  {
    icon: Database,
    title: 'System',
    settings: [
      { label: 'Maintenance mode',              desc: 'Disable student access during maintenance',           key: 'maintenance', default: false },
      { label: 'Auto-approve classroom bookings', desc: 'Automatically confirm classroom reservations',     key: 'autoClass',  default: false },
    ],
  },
]

export default function AdminSettings() {
  const [toggles, setToggles] = useState(() => {
    const init = {}
    SECTIONS.forEach(({ settings }) => settings.forEach(({ key, default: def }) => { init[key] = def }))
    return init
  })
  const [saved, setSaved] = useState(false)

  function toggle(key) {
    setToggles((p) => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      <div>
        <h1 className="text-xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">System-wide configuration for FUOYE Smart Space</p>
      </div>

      {SECTIONS.map(({ icon: Icon, title, settings }) => (
        <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}>
              <Icon size={15} style={{ color: '#0B5D1E' }} />
            </div>
            <h3 className="text-sm font-bold text-gray-700">{title}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {settings.map(({ label, desc, key }) => (
              <div key={key} className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 flex-shrink-0',
                  ].join(' ')}
                  style={{ backgroundColor: toggles[key] ? '#0B5D1E' : '#d1d5db' }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: toggles[key] ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        {saved && (
          <p className="text-xs font-semibold" style={{ color: '#0B5D1E' }}>
            Settings saved successfully.
          </p>
        )}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#0B5D1E' }}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
