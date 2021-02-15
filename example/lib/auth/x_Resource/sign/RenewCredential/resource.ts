import { RenewComponent } from "./Renew/component"

import { AuthLocationAction } from "../../../sign/authLocation/action"
import { RenewAuthCredentialAction } from "../../../sign/authCredential/renew/action"
import { ContinuousRenewAuthCredentialAction } from "../../../sign/authCredential/continuousRenew/action"

export type RenewCredentialResource = Readonly<{
    renew: RenewComponent
}>

export type RenewCredentialForegroundAction = Readonly<{
    renew: RenewAuthCredentialAction
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction
}>
