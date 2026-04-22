const API_URL = "http://72.61.162.43:8000"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  password_strength: string | null
}

export interface RegisterPayload {
  email: string
  password: string
  company_name: string
  website: string
}

export interface RegisterResponse {
  id: string
  email: string
  company_name: string
  website: string
  role: string
  is_active: boolean
  password_strength: string
  message: string
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error ?? "Identifiants incorrects")
  }
  return res.json()
}


export async function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_REGISTER_SECRET}`,  //remplace par le vrai token
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error ?? "Erreur lors de l'inscription")
  }
  return res.json()
}

export async function activateApi(token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/activate?token=${token}`, {
    method: "GET",
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error ?? "Lien d'activation invalide ou expiré")
  }
  return res.json()
} 