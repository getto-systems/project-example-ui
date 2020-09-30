import { ApiCredential, FetchError } from "./data"

export type Infra = Readonly<{
    apiCredentials: ApiCredentialRepository
}>

export interface ApiCredentialRepository {
    findApiCredential(): FindResponse<ApiCredential>
}

export type StorageKey = Readonly<{
    apiCredential: string
}>

export type FindResponse<T> =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>
