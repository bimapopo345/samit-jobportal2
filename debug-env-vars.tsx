// SAMIT - Debug Environment Variables
// Temporary component to check if env vars are loaded

'use client'

export function DebugEnvVars() {
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded text-xs z-50">
      <h3 className="font-bold mb-2">Environment Debug:</h3>
      <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing'}</p>
      <p>SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}</p>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</p>
      <p>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
    </div>
  )
}