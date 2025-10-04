import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDonghuaSlug(slug: string): string {
  // Remove trailing slashes first
  const cleanSlug = slug.replace(/\/+$/, "").trim()

  // Remove episode patterns:
  // - "episode-123-subtitle-indonesia"
  // - "episode-123-sub-indo"
  // - "episode-123"
  const patterns = [/-episode-\d+-subtitle-indonesia$/i, /-episode-\d+-sub-indo$/i, /-episode-\d+$/i]

  let result = cleanSlug
  for (const pattern of patterns) {
    result = result.replace(pattern, "")
  }

  console.log("[v0] extractDonghuaSlug:", { input: slug, output: result })
  return result
}

export function formatEpisodeNumber(episodeText: string): string {
  // Extract episode number from various formats:
  // "Lingwu Continent Episode 114 Subtitle Indonesia" -> "Eps 114"
  // "Episode 114 Subtitle Indonesia" -> "Eps 114"
  // "Episode 114" -> "Eps 114"
  const match = episodeText.match(/episode[- ]?(\d+)/i)
  if (match) {
    return `Eps ${match[1]}`
  }
  return episodeText
}
