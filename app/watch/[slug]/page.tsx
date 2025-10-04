"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Download, ArrowLeft, Play } from "lucide-react"
import type { EpisodeDetail } from "@/lib/types"
import { useState, useEffect, useRef, useCallback } from "react"
import { extractDonghuaSlug, formatEpisodeNumber } from "@/lib/utils"

export default function WatchPage({
  params,
}: {
  params: { slug: string }
}) {
  const [data, setData] = useState<EpisodeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentServer, setCurrentServer] = useState<string>("")
  const [displayedEpisodes, setDisplayedEpisodes] = useState(7)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const donghuaSlug = data?.donghua_details?.slug
    ? extractDonghuaSlug(data.donghua_details.slug)
    : extractDonghuaSlug(params.slug)

  const loadMoreEpisodes = useCallback(() => {
    if (data?.navigation?.all_episodes && displayedEpisodes < data.navigation.all_episodes.length) {
      setDisplayedEpisodes((prev) => Math.min(prev + 7, data.navigation.all_episodes.length))
    }
  }, [data, displayedEpisodes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreEpisodes()
        }
      },
      {
        threshold: 0.1,
        root: scrollContainerRef.current, // Observe within container, not window
      },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMoreEpisodes])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/donghua/watch/${params.slug}`)
        if (!response.ok) throw new Error("Failed to fetch episode")
        const result = await response.json()
        setData(result)
        if (result?.streaming?.main_url?.url) {
          setCurrentServer(result.streaming.main_url.url)
        }
        setDisplayedEpisodes(7)
      } catch (error) {
        console.error("Error fetching episode:", error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Episode not found</h1>
            <p className="text-muted-foreground">The episode you're looking for doesn't exist.</p>
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
        <div className="space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild>
            <Link href={`/detail/${donghuaSlug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Detail
            </Link>
          </Button>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">{data.donghua_details?.title || data.episode}</h1>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {formatEpisodeNumber(data.episode)}
            </Badge>
          </div>

          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black">
                {currentServer ? (
                  <iframe
                    key={currentServer}
                    src={currentServer}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={data.episode}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white">Video player not available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Server Selection & Navigation */}
          <div className="flex flex-col gap-3">
            {/* Server Selector */}
            {data.streaming?.servers && data.streaming.servers.length > 0 && (
              <Select value={currentServer} onValueChange={setCurrentServer}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Select Video Server" />
                </SelectTrigger>
                <SelectContent>
                  {data.streaming.main_url && (
                    <SelectItem value={data.streaming.main_url.url}>
                      {data.streaming.main_url.name || "Select Video Server"}
                    </SelectItem>
                  )}
                  {data.streaming.servers.map((server, index) => (
                    <SelectItem key={index} value={server.url}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3">
              {data.navigation?.previous_episode ? (
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href={`/watch/${data.navigation.previous_episode.slug}`}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="lg" disabled className="bg-transparent">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
              )}

              <Button asChild variant="default" size="lg" className="min-w-[140px]">
                <Link href={`/detail/${donghuaSlug}`}>All Episodes</Link>
              </Button>

              {data.navigation?.next_episode ? (
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href={`/watch/${data.navigation.next_episode.slug}`}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="lg" disabled className="bg-transparent">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {data.navigation?.all_episodes && data.navigation.all_episodes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Episodes</h2>
              {/* Fixed height container with overflow scroll */}
              <div
                ref={scrollContainerRef}
                className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
              >
                {data.navigation.all_episodes.slice(0, displayedEpisodes).map((episode) => (
                  <Link key={episode.slug} href={`/watch/${episode.slug}`}>
                    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                      <CardContent className="p-0">
                        <div className="flex gap-3 p-3">
                          {/* Thumbnail */}
                          <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={
                                data.donghua_details?.poster ||
                                "/placeholder.svg?height=64&width=96&query=episode thumbnail" ||
                                "/placeholder.svg"
                              }
                              alt={formatEpisodeNumber(episode.episode)}
                              fill
                              className="object-cover transition-transform group-hover:scale-110"
                              sizes="96px"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          {/* Episode Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-semibold text-sm mb-1 truncate">
                              {formatEpisodeNumber(episode.episode)}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{episode.episode}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {/* Load more indicator */}
                {displayedEpisodes < data.navigation.all_episodes.length && (
                  <div ref={observerTarget} className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">Loading more episodes...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Links */}
          {data.download_url && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Options
                </h3>
                <div className="space-y-4">
                  {Object.entries(data.download_url).map(([quality, providers]) => {
                    if (!providers || Object.keys(providers).length === 0) return null

                    const qualityLabel = quality.replace("download_url_", "").toUpperCase()

                    return (
                      <div key={quality} className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">{qualityLabel}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Object.entries(providers).map(([provider, url]) => (
                            <Button key={provider} asChild variant="outline" size="sm">
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                {provider}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
