import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
  },
})

export type Card = {
  id: string
  name: string
  description: string
  lore: string
  type: 'creature' | 'spell' | 'artifact'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  mana_cost: number
  attack: number | null
  defense: number | null
  image_url: string
  created_at: string
}

export type Deck = {
  id: string
  user_id: string
  name: string
  description: string
  is_public: boolean
  created_at: string
}

export type Profile = {
  id: string
  username: string
  avatar_url: string
  wins: number
  losses: number
  is_admin: boolean
  created_at: string
}

// Fetch the current user's profile including is_admin
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}

// Sign in with Google
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut()
}
