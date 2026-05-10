import { redirect } from 'next/navigation'

export default function DeckPage({ params }: { params: { id: string } }) {
  // In a real app, load deck from Supabase and render the builder pre-populated
  redirect('/decks/new')
}
