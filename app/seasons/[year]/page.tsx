import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonghuaGrid } from "@/components/donghua-grid"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFromAPI } from "@/lib/api"

async function getSeasonDonghua(year: string) {
  try {
    return await fetchFromAPI(`/api/donghua/seasons/${year}`, { cache: "no-store" })
  } catch (error) {
    console.error("Error fetching season data:", error)
    return { data: [] }
  }
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ year: string }>
}) {
  const { year } = await params
  const data = await getSeasonDonghua(year)

  const donghuaList = data.data || data.donghua || data.season || (Array.isArray(data) ? data : [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance">Donghua {year}</h1>
            <p className="text-muted-foreground text-balance">Donghua released in {year}</p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <DonghuaGrid donghua={donghuaList} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
