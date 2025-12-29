// Client-side authentication utilities

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('adminToken', token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  }
  
  return fetch(url, { ...options, headers })
}
