import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../utils/authStorage'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    department: '',
    level: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)

    const result = registerUser(formData)

    setTimeout(() => {
      setLoading(false)

      if (!result.success) {
        setError(result.message)
        return
      }

      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Create Student Account
        </h1>

        <p className="text-gray-500 mb-6">
          FUOYE Smart Space System
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            name="matricNumber"
            placeholder="Matric Number"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            name="level"
            placeholder="Level"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <select
            name="gender"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg md:col-span-2 transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-700 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}