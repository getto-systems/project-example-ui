import {
    ClearAuthCredentialComponent,
    ClearAuthCredentialForegroundMaterial,
} from "./ClearAuthCredential/component"

export type AuthProfileLogoutResource = Readonly<{
    clearAuthCredential: ClearAuthCredentialComponent
}>

export type AuthProfileLogoutMaterial = Readonly<{
    foreground: AuthProfileLogoutForegroundMaterial
}>
export type AuthProfileLogoutForegroundMaterial = ClearAuthCredentialForegroundMaterial
