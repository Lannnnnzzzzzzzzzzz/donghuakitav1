import { DonghuaCard } from "@/components/donghua-card"
import type { DonghuaCard as DonghuaCardType } from "@/lib/types"

interface DonghuaGridProps {
  donghua: DonghuaCardType[]
  title?: string
}

export function DonghuaGrid({ donghua, title }: DonghuaGridProps) {
  if (!donghua || donghua.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No donghua found.</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      {title && <h2 className="text-2xl font-bold text-balance">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {donghua.map((item, index) => (
          <DonghuaCard key={`${item.slug}-${index}`} donghua={item} />
        ))}
      </div>
    </section>
  )
}
