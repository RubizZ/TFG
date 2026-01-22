export interface AuthenticatedUser {
    userId: string,
    token: string,
    authVersion: number
}