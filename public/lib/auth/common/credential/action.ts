import { AuthCredential, LoadLastLoginResult, StoreResult } from "./data"

export interface LoadLastLogin {
    (): LoadLastLoginAction
}
export interface LoadLastLoginAction {
    (): LoadLastLoginResult
}

export interface StoreAuthCredential {
    (): StoreAuthCredentialAction
}
export interface StoreAuthCredentialAction {
    (authCredential: AuthCredential): StoreResult
}

export interface RemoveAuthCredential {
    (): RemoveAuthCredentialAction
}
export interface RemoveAuthCredentialAction {
    (): StoreResult
}
