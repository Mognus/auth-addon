export interface Role {
  id: number
  name: 'admin' | 'user' | 'guest'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  roleId: number
  role: Role
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface AuthError {
  error: string
  details?: Record<string, string>
}
