// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'

// export async function middleware(req) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })
  
//   await supabase.auth.getSession()
//   return res
// }
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    // 1. Initialize Supabase client
    const supabase = createMiddlewareClient({ req: request, res: response })
    
    // 2. Get session (simplified but with error handling)
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase session error:', error)
      // Clear potentially corrupted auth state
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
    }

    return response

  } catch (error) {
    console.error('Middleware execution failed:', error)
    
    // Fallback response that won't break the application
    const fallbackResponse = NextResponse.next()
    // Ensure we don't leave corrupted auth state
    fallbackResponse.cookies.delete('sb-access-token')
    fallbackResponse.cookies.delete('sb-refresh-token')
    return fallbackResponse
  }
}

// Match all paths except static files and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|auth).*)']
}