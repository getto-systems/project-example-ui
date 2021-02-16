import {
    RenewAuthnInfoAction,
    RenewAuthnInfoMaterial,
} from "../../../../sign/x_Action/AuthnInfo/Renew/action"

export type AuthSignRenewResource = Readonly<{
    renew: RenewAuthnInfoAction
}>

export type AuthSignRenewMaterial = RenewAuthnInfoMaterial
