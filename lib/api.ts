export function getBaseUrl() {
  // For server-side rendering in production (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // For client-side or local development
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Fallback for local development server-side
  return "http://localhost:3000"
}

export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] API fetch error:", error)
    throw error
  }
}
