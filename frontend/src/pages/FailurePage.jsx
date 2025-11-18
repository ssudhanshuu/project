import { useNavigate } from 'react-router-dom'

export default function PaymentFailure() {
  const nav = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
      <h2 className="text-3xl text-red-600">❌ Payment Failed!</h2>
      <p className="text-gray-500">There was a problem processing your payment. Please try again.</p>
      <button
        onClick={() => nav('/')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back to Home
      </button>
    </div>
  )
}
