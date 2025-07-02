"use client"

import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="neubrutalism-card p-8 bg-white">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold uppercase mb-4">Oops!</h1>
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8 font-medium">
            We encountered an error while processing your request. Don't worry, our AI is working to fix it!
          </p>

          <div className="space-y-4">
            <Link href="/">
              <button className="neubrutalism-button w-full flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                GO HOME
              </button>
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border-2 border-black rounded-lg font-bold bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              TRY AGAIN
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 font-medium">Error Code: SHOPWHIZ_AI_ERROR_001</p>
      </div>
    </div>
  )
}
