import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
