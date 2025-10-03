import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Play, Calendar, Star } from "lucide-react"
import type { DonghuaDetail } from "@/lib/types"
import { fetchFromAPI } from "@/lib/api"

async function getDonghuaDetail(slug: string) {
  try {
    return await fetchFromAPI(`/api/donghua/detail/${slug}`, { cache: "no-store" })
  } catch (error) {
    console.error("Error fetching detail:", error)
    return null
  }
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data: DonghuaDetail | null = await getDonghuaDetail(slug)

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Donghua not found</h1>
            <p className="text-muted-foreground">The donghua you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Poster */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={data.poster || "/placeholder.svg?height=450&width=300&query=donghua poster"}
                      alt={data.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                </CardContent>
              </Card>
              {data.episodes_list && data.episodes_list.length > 0 && (
                <Button asChild className="w-full" size="lg">
                  <Link href={`/watch/${data.episodes_list[0].slug}`}>
                    <Play className="mr-2 h-5 w-5" />
                    Watch Now
                  </Link>
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-balance">{data.title}</h1>
                {data.alter_title && <p className="text-lg text-muted-foreground text-balance">{data.alter_title}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {data.status}
                </Badge>
                <Badge variant="outline">{data.type}</Badge>
                {data.rating && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {data.rating}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.released && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Release:</span>
                    <span className="font-medium">{data.released}</span>
                  </div>
                )}
                {data.studio && (
                  <div>
                    <span className="text-muted-foreground">Studio:</span>
                    <span className="font-medium ml-2">{data.studio}</span>
                  </div>
                )}
                {data.episodes_count && (
                  <div>
                    <span className="text-muted-foreground">Episodes:</span>
                    <span className="font-medium ml-2">{data.episodes_count}</span>
                  </div>
                )}
                {data.duration && (
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium ml-2">{data.duration}</span>
                  </div>
                )}
              </div>

              {data.genres && data.genres.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((genre) => (
                      <Badge key={genre.slug} variant="outline">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {data.synopsis || "No synopsis available."}
                </p>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          {data.episodes_list && data.episodes_list.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {data.episodes_list.map((episode) => (
                  <Button key={episode.slug} asChild variant="outline" className="h-auto py-3 bg-transparent">
                    <Link href={`/watch/${episode.slug}`}>
                      <div className="flex flex-col items-center gap-1">
                        <Play className="h-4 w-4" />
                        <span className="text-xs font-medium text-center">{episode.episode}</span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
