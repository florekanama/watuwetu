
// 'use client'
// import { createContext, useContext, useEffect, useState, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/client'

// type UserRole = 'admin' | 'medecin' | 'patient'
 
// interface User {
//   id: string
//   nom: string
//   email: string
//   role: UserRole
//   profil_url: string | null
//   statut: boolean
//   date_creation: string
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   signUp: (nom: string, email: string, password: string, role: UserRole) => Promise<{ error?: string }>
//   signIn: (email: string, password: string) => Promise<{ error?: string }>
//   signOut: () => Promise<void>
//   updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
//   uploadProfileImage: (file: File) => Promise<{ url: string | null; error?: string }>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   const fetchUserProfile = useCallback(async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', userId)
//         .single()

//       if (error) throw error
//       setUser(data)
//     } catch (error) {
//       console.error('Error fetching profile:', error)
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     const getSession = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession()
//         if (session?.user) {
//           await fetchUserProfile(session.user.id)
//         } else {
//           setLoading(false)
//         }
//       } catch (error) {
//         console.error('Error fetching session:', error)
//         setLoading(false)
//       }
//     }

//     getSession()

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event === 'SIGNED_IN' && session?.user) {
//         await fetchUserProfile(session.user.id)
//       } else if (event === 'SIGNED_OUT') {
//         setUser(null)
//         setLoading(false)
//       }
//     })

//     return () => subscription?.unsubscribe()
//   }, [fetchUserProfile])

//   const signUp = async (nom: string, email: string, password: string, role: UserRole) => {
//     try {
//       setLoading(true)
      
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email,
//         password,
//         options: { data: { nom, role } }
//       })

//       if (authError) throw authError
//       if (!authData.user) throw new Error('User creation failed')

//       const { error: profileError } = await supabase
//         .from('users')
//         .insert([{
//           id: authData.user.id,
//           nom,
//           email,
//           role,
//           statut: true
//         }])

//       if (profileError) throw profileError

//       return {}
//     } catch (error: any) {
//       console.error('SignUp error:', error)
//       return { 
//         error: error.message.includes('already registered') 
//           ? 'Un compte existe déjà avec cet email' 
//           : "Erreur lors de l'inscription" 
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const signIn = async (email: string, password: string) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase.auth.signInWithPassword({ email, password })
//       if (error) throw error
//       return {}
//     } catch (error: any) {
//       console.error('SignIn error:', error)
//       return { 
//         error: error.message.includes('Invalid login credentials')
//           ? 'Email ou mot de passe incorrect'
//           : "Erreur lors de la connexion"
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const signOut = async () => {
//     try {
//       setLoading(true)
//       await supabase.auth.signOut()
//       setUser(null)
//       router.push('/login')
//     } catch (error) {
//       console.error('Error signing out:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateProfile = async (updates: Partial<User>) => {
//     if (!user) return { error: 'Non authentifié' }

//     try {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('users')
//         .update(updates)
//         .eq('id', user.id)
//         .select()
//         .single()

//       if (error) throw error
//       setUser(data)
//       return {}
//     } catch (error: any) {
//       console.error('Update error:', error)
//       return { error: error.message }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const uploadProfileImage = async (file: File) => {
//     if (!user) return { url: null, error: 'Non authentifié' }

//     try {
//       const fileExt = file.name.split('.').pop()
//       const filePath = `${user.id}/avatar.${fileExt}`

//       const { error: uploadError } = await supabase.storage
//         .from('profiles')
//         .upload(filePath, file, { upsert: true })

//       if (uploadError) throw uploadError

//       const { data: { publicUrl } } = supabase.storage
//         .from('profiles')
//         .getPublicUrl(filePath)

//       await updateProfile({ profil_url: publicUrl })
//       return { url: publicUrl }
//     } catch (error: any) {
//       console.error('Upload error:', error)
//       return { url: null, error: error.message }
//     }
//   }

//   const value = {
//     user,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//     updateProfile,
//     uploadProfileImage
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type UserRole = 'admin' | 'medecin' | 'patient'

interface User {
  id: string
  nom: string
  email: string
  role: UserRole
  profil_url: string | null
  statut: boolean
  date_creation: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (nom: string, email: string, password: string, role: UserRole) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
  uploadProfileImage: (file: File) => Promise<{ url: string | null; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [fetchUserProfile])

  // const signUp = async (nom: string, email: string, password: string, role: UserRole) => {
  //   try {
  //     setLoading(true)
      
  //     const { data: authData, error: authError } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: { data: { nom, role } }
  //     })

  //     if (authError) throw authError
  //     if (!authData.user) throw new Error('User creation failed')

  //     const { error: profileError } = await supabase
  //       .from('users')
  //       .insert([{
  //         id: authData.user.id,
  //         nom,
  //         email,
  //         role,
  //         statut: true
  //       }])

  //     if (profileError) throw profileError

  //     return {}
  //   } catch (error: any) {
  //     console.error('SignUp error:', error)
  //     return { 
  //       error: error.message.includes('already registered') 
  //         ? 'Un compte existe déjà avec cet email' 
  //         : "Erreur lors de l'inscription" 
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }
const signUp = async (nom: string, email: string, password: string, role: UserRole) => {
  try {
    setLoading(true);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, role } // This stores metadata in auth.users
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create minimal profile in public.users
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        nom,
        email,
        role,
        statut: true
      }]);

    if (profileError) throw profileError;

    return {};
  } catch (error: any) {
    console.error('SignUp error:', error);
    return { 
      error: error.message.includes('already registered') 
        ? 'Un compte existe déjà avec cet email' 
        : "Erreur lors de l'inscription" 
    };
  } finally {
    setLoading(false);
  }
};
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return {}
    } catch (error: any) {
      console.error('SignIn error:', error)
      return { 
        error: error.message.includes('Invalid login credentials')
          ? 'Email ou mot de passe incorrect'
          : "Erreur lors de la connexion"
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'Non authentifié' }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setUser(data)
      return {}
    } catch (error: any) {
      console.error('Update error:', error)
      return { error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const uploadProfileImage = async (file: File) => {
    if (!user) return { url: null, error: 'Non authentifié' }

    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      await updateProfile({ profil_url: publicUrl })
      return { url: publicUrl }
    } catch (error: any) {
      console.error('Upload error:', error)
      return { url: null, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadProfileImage
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
