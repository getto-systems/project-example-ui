import { AuthCredential, LoadLastLoginResult, StoreResult } from "./data"

export type StoreInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findLastLogin(): LoadLastLoginResult
    storeAuthCredential(authCredential: AuthCredential): StoreResult
    removeAuthCredential(): StoreResult
}

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastLoginAt: string
}>
