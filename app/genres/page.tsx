import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Genre } from "@/lib/types"
import { fetchFromAPI } from "@/lib/api"

async function getGenres() {
  try {
    return await fetchFromAPI(`/api/donghua/genres`, { cache: "no-store" })
  } catch (error) {
    console.error("[v0] Error fetching genres:", error)
    return { data: [] }
  }
}

export default async function GenresPage() {
  const data = await getGenres()
  const genres: Genre[] = data.data || []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance">Browse by Genre</h1>
            <p className="text-muted-foreground text-balance">Explore donghua by your favorite genres</p>
          </div>

          {genres.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genres.map((genre) => (
                <Link key={genre.slug} href={`/genres/${genre.slug}`}>
                  <Card className="group transition-all hover:shadow-lg hover:scale-105 bg-transparent">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{genre.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No genres available.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
