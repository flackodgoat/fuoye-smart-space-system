import { useState } from 'react'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Forgot Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Matric Number or Email"
              required
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button className="w-full bg-green-700 text-white py-3 rounded-lg">
              Reset Password
            </button>
          </form>
        ) : (
          <div className="bg-green-100 text-green-700 p-4 rounded">
            Password reset link simulation sent successfully.
          </div>
        )}
      </div>
    </div>
  )
}