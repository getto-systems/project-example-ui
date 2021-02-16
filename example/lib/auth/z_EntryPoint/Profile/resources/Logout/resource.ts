import {
    ClearAuthCredentialAction,
    ClearAuthCredentialMaterial,
} from "../../../../sign/x_Action/AuthCredential/Clear/action"

export type AuthProfileLogoutResource = Readonly<{
    clear: ClearAuthCredentialAction
}>

export type AuthProfileLogoutMaterial = Readonly<{
    clear: ClearAuthCredentialMaterial
}>
