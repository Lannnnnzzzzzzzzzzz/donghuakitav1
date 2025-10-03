"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonghuaGrid } from "@/components/donghua-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import type { DonghuaCard } from "@/lib/types"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState<DonghuaCard[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setHasSearched(true)
    setCurrentPage(1)

    try {
      const res = await fetch(`/api/donghua/search/${encodeURIComponent(keyword)}/1`)
      const data = await res.json()
      const donghuaList = data.data || data.results || data.search || (Array.isArray(data) ? data : [])
      setResults(donghuaList)
      router.push(`/search?q=${encodeURIComponent(keyword)}`)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get("q")
    if (q && q !== keyword) {
      setKeyword(q)
      setHasSearched(true)
      setLoading(true)
      fetch(`/api/donghua/search/${encodeURIComponent(q)}/1`)
        .then((res) => res.json())
        .then((data) => {
          const donghuaList = data.data || data.results || data.search || (Array.isArray(data) ? data : [])
          setResults(donghuaList)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Search error:", error)
          setResults([])
          setLoading(false)
        })
    }
  }, [searchParams, keyword])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">Search Donghua</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for donghua..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <>
                <p className="text-muted-foreground">
                  Found {results.length} results for "{keyword}"
                </p>
                <DonghuaGrid donghua={results} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{keyword}"</p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Enter a keyword to search for donghua</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
