import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DonghuaCardType } from "@/lib/types"
import { extractDonghuaSlug } from "@/lib/utils"

interface DonghuaCardProps {
  donghua: DonghuaCardType
}

export function DonghuaCard({ donghua }: DonghuaCardProps) {
  const donghuaSlug = extractDonghuaSlug(donghua.slug)

  console.log("[v0] DonghuaCard:", {
    originalSlug: donghua.slug,
    extractedSlug: donghuaSlug,
    title: donghua.title,
  })

  return (
    <Link href={`/detail/${donghuaSlug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-105">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={donghua.poster || "/placeholder.svg?height=450&width=300&query=donghua poster"}
              alt={donghua.title}
              fill
              className="object-cover transition-transform group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            {donghua.episode && (
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{donghua.episode}</Badge>
            )}
            {donghua.status && (
              <Badge variant="secondary" className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                {donghua.status}
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold line-clamp-2 text-balance">{donghua.title}</h3>
            {donghua.rating && <p className="text-xs text-muted-foreground mt-1">⭐ {donghua.rating}</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DonghuaCard
