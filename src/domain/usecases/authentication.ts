export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  accessToken: string
  name: string
}

export interface Authentication {
  auth: (authentication: AuthenticationParams) => Promise<AuthenticationResult>
}
