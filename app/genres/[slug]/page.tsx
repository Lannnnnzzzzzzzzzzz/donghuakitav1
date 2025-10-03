import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonghuaGrid } from "@/components/donghua-grid"
import { Pagination } from "@/components/pagination"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFromAPI } from "@/lib/api"

async function getGenreDonghua(slug: string, page = 1) {
  try {
    return await fetchFromAPI(`/api/donghua/genres/${slug}/${page}`, { cache: "no-store" })
  } catch (error) {
    console.error("Error fetching genre data:", error)
    return { data: [], currentPage: 1, genre: slug }
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

export default async function GenreDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Number.parseInt(page || "1")
  const data = await getGenreDonghua(slug, currentPage)

  const donghuaList = data.data || data.donghua || data.genre || (Array.isArray(data) ? data : [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance capitalize">{slug.replace(/-/g, " ")}</h1>
            <p className="text-muted-foreground text-balance">Donghua in this genre</p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <DonghuaGrid donghua={donghuaList} />
          </Suspense>

          <Pagination currentPage={currentPage} basePath={`/genres/${slug}`} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
