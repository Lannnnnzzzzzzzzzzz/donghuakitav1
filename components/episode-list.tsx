"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import { formatEpisodeNumber } from "@/lib/utils"

interface Episode {
  slug: string
  episode: string
}

interface EpisodeListProps {
  episodes: Episode[]
  poster?: string
}

export default function EpisodeList({ episodes, poster }: EpisodeListProps) {
  const [displayedEpisodes, setDisplayedEpisodes] = useState(7)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMoreEpisodes = useCallback(() => {
    if (displayedEpisodes < episodes.length) {
      setDisplayedEpisodes((prev) => Math.min(prev + 7, episodes.length))
    }
  }, [episodes.length, displayedEpisodes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreEpisodes()
        }
      },
      {
        threshold: 0.1,
        root: scrollContainerRef.current,
      },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMoreEpisodes])

  return (
    <div
      ref={scrollContainerRef}
      className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
    >
      {episodes.slice(0, displayedEpisodes).map((episode) => (
        <Link key={episode.slug} href={`/watch/${episode.slug}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="p-0">
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={poster || "/placeholder.svg?height=64&width=96&query=episode thumbnail"}
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
                  <h3 className="font-semibold text-sm mb-1 truncate">{formatEpisodeNumber(episode.episode)}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{episode.episode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {/* Load more indicator */}
      {displayedEpisodes < episodes.length && (
        <div ref={observerTarget} className="py-4 text-center">
          <p className="text-sm text-muted-foreground">Loading more episodes...</p>
        </div>
      )}
    </div>
  )
}
