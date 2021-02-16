import {
    ClearAuthnInfoAction,
    ClearAuthnInfoMaterial,
} from "../../../../sign/x_Action/AuthnInfo/Clear/action"

export type AuthProfileLogoutResource = Readonly<{
    clear: ClearAuthnInfoAction
}>

export type AuthProfileLogoutMaterial = Readonly<{
    clear: ClearAuthnInfoMaterial
}>
