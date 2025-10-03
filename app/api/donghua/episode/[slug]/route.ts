import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://www.sankavollerei.com"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const response = await fetch(`${BASE_URL}/anime/donghua/episode/${slug}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching episode:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
