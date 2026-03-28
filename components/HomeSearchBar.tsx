'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeSearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-14 pr-32 py-5 text-lg border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-blue-600 transition-all outline-none bg-gray-50 focus:bg-white" 
        placeholder="Ej. Apartamento en la Zona Oriental, Programador..."
      />
      <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-colors">
        Buscar
      </button>
    </form>
  )
}
