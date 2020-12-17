import { AuthCredential, LoadLastLoginResult, StoreResult } from "./data"

export type StoreCredentialAction = Readonly<{
    storeAuthCredential: StoreAuthCredentialPod
}>
export type CredentialAction = Readonly<{
    loadLastLogin: LoadLastLoginPod
    removeAuthCredential: RemoveAuthCredentialPod
}>

export interface LoadLastLoginPod {
    (): LoadLastLogin
}
export interface LoadLastLogin {
    (): LoadLastLoginResult
}

export interface StoreAuthCredentialPod {
    (): StoreAuthCredential
}
export interface StoreAuthCredential {
    (authCredential: AuthCredential): StoreResult
}

export interface RemoveAuthCredentialPod {
    (): RemoveAuthCredential
}
export interface RemoveAuthCredential {
    (): StoreResult
}
