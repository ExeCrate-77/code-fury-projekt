export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T = { data: unknown }>(
  token: string | null,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (res.status === 204) return null as T

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(
      res.status,
      json.error || `Request failed with status ${res.status}`
    )
  }
  return json as T
}
