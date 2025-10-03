import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonghuaGrid } from "@/components/donghua-grid"
import { Pagination } from "@/components/pagination"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFromAPI } from "@/lib/api"

async function getDonghuaHome(page = 1) {
  try {
    const result = await fetchFromAPI(`/api/donghua/home/${page}`, { cache: "no-store" })
    return result
  } catch (error) {
    console.error("Error fetching home data:", error)
    return { latest_release: [], completed_donghua: [] }
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number.parseInt(params.page || "1")
  const data = await getDonghuaHome(currentPage)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance">Latest Donghua</h1>
            <p className="text-muted-foreground text-balance">Watch the latest Chinese anime series online</p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <DonghuaGrid donghua={data.latest_release || []} />
          </Suspense>

          <Pagination currentPage={currentPage} basePath="" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
