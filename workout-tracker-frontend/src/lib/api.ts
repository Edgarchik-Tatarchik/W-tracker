const API = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, ...rest } = options

  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  })

  if (response.status === 204) return null as T

  const data = await response.json()

  if (!response.ok) {
    const message =
      data.email ?? data.password ?? data.name ?? data.error ?? "Request failed"
    throw new ApiError(message, response.status)
  }

  return data as T
}

export async function apiFetchText(
  path: string,
  options: FetchOptions = {}
): Promise<string> {
  const { body, ...rest } = options

  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  })

  if (!response.ok) {
    throw new ApiError("Request failed", response.status)
  }

  return response.text()
}
