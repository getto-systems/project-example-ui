import { Clock } from "../../../../z_infra/clock/infra"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { DelayTime, ExpireTime } from "../../../../z_infra/time/infra"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthCredentialRepository, RenewAuthCredentialRemoteAccess } from "../common/infra"

import { ForceRequestRenewAuthCredentialMethod, RequestRenewAuthCredentialMethod } from "./action"

export type RenewAuthCredentialActionInfra = RequestRenewAuthCredentialInfra

export type RequestRenewAuthCredentialInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    renew: RenewAuthCredentialRemoteAccess
    clock: Clock
    delayed: Delayed
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>

export interface RequestRenewAuthCredential {
    (infra: RequestRenewAuthCredentialInfra): RequestRenewAuthCredentialMethod
}
export interface ForceRequestRenewAuthCredential {
    (infra: RequestRenewAuthCredentialInfra): ForceRequestRenewAuthCredentialMethod
}
