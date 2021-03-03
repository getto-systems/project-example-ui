import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"
import { Clock } from "../../../../z_vendor/getto-application/infra/clock/infra"

import { AuthRemoteValue } from "../../kernel/authInfo/kernel/infra"

import { AuthInfo } from "../../kernel/authInfo/kernel/data"
import { AuthenticateFields, AuthenticateRemoteError } from "./data"

export type AuthenticateInfra = Readonly<{
    authenticate: AuthenticateRemotePod
    clock: Clock
    config: Readonly<{
        delay: DelayTime
    }>
}>

type AuthenticateRemoteTypes = RemoteTypes<
    AuthenticateFields,
    AuthInfo,
    AuthRemoteValue,
    AuthenticateRemoteError
>
export type AuthenticateRemotePod = AuthenticateRemoteTypes["pod"]
export type AuthenticateResult = AuthenticateRemoteTypes["result"]
export type AuthenticateSimulator = AuthenticateRemoteTypes["simulator"]
