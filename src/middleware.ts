// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'


// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next()
//   const supabase = createMiddlewareClient({ req: request, res: response })
  
//   // Forcer la récupération de session sans vérification
//   await supabase.auth.getSession()
  
//   return response
// }
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req: request, res: response })
    
    // Attempt to get session (will refresh session if needed)
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware auth error:', error)
      // Optionally handle specific auth errors here
    }
    
    // You can add route protection logic here if needed
    // Example:
    // if (!session && request.nextUrl.pathname.startsWith('/protected')) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
    
    return response
  } catch (err) {
    console.error('Middleware error:', err)
    // Return the response even if there was an error
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}