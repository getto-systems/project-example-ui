import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"
import { Clock } from "../../../../z_vendor/getto-application/infra/clock/infra"

import { AuthRemoteValue } from "../../auth_ticket/kernel/infra"

import { AuthTicket } from "../../auth_ticket/kernel/data"
import { AuthenticatePasswordFields, AuthenticatePasswordRemoteError } from "./data"

export type AuthenticatePasswordInfra = Readonly<{
    authenticate: AuthenticatePasswordRemotePod
    clock: Clock
    config: Readonly<{
        takeLongtimeThreshold: DelayTime
    }>
}>

type AuthenticatePasswordRemoteTypes = RemoteTypes<
    AuthenticatePasswordFields,
    AuthTicket,
    AuthRemoteValue,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemotePod = AuthenticatePasswordRemoteTypes["pod"]
export type AuthenticatePasswordResult = AuthenticatePasswordRemoteTypes["result"]
export type AuthenticatePasswordSimulator = AuthenticatePasswordRemoteTypes["simulator"]
