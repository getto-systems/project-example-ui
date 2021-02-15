import { RenewComponent } from "./Renew/component"

import { LocationActionPod, LocationActionLocationInfo } from "../../../sign/location/action"
import { RenewAction } from "../../../sign/authCredential/renew/action"
import { ContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/action"

export type RenewCredentialResource = Readonly<{
    renew: RenewComponent
}>

export type RenewCredentialLocationInfo = LocationActionLocationInfo
export type RenewCredentialForegroundAction = Readonly<{
    renew: RenewAction
    continuousRenew: ContinuousRenewAction
    initLocation: LocationActionPod
}>
