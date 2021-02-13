import { RenewComponent } from "./Renew/component"

import { LocationActionPod, LocationActionLocationInfo } from "../../../sign/location/action"
import { RenewActionPod } from "../../../sign/authCredential/renew/action"
import { ContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/action"

export type RenewCredentialResource = Readonly<{
    renew: RenewComponent
}>

export type RenewCredentialLocationInfo = LocationActionLocationInfo
export type RenewCredentialForegroundActionPod = Readonly<{
    initRenew: RenewActionPod
    initContinuousRenew: ContinuousRenewActionPod
    initLocation: LocationActionPod
}>
