import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentSuccess() {
  const nav = useNavigate()
  const [search] = useSearchParams()
  const bookingId = search.get('bookingId')

  useEffect(() => {
    const timer = setTimeout(() => {
      nav('/')
    }, 3000)
    return () => clearTimeout(timer)
  }, [nav])

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-3xl text-green-600 mb-4">✅ Payment Successful!</h2>
      <p className="text-gray-500">Redirecting to home...</p>
      {bookingId && <p className="text-sm text-gray-400 mt-2">Booking: {bookingId}</p>}
    </div>
  )
}
