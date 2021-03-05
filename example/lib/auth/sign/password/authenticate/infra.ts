import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"
import { Clock } from "../../../../z_vendor/getto-application/infra/clock/infra"

import { AuthRemoteValue } from "../../kernel/authInfo/kernel/infra"

import { AuthInfo } from "../../kernel/authInfo/kernel/data"
import { AuthenticatePasswordFields, AuthenticatePasswordRemoteError } from "./data"

export type AuthenticatePasswordInfra = Readonly<{
    authenticate: AuthenticatePasswordRemotePod
    clock: Clock
    config: Readonly<{
        delay: DelayTime
    }>
}>

type AuthenticatePasswordRemoteTypes = RemoteTypes<
    AuthenticatePasswordFields,
    AuthInfo,
    AuthRemoteValue,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemotePod = AuthenticatePasswordRemoteTypes["pod"]
export type AuthenticatePasswordResult = AuthenticatePasswordRemoteTypes["result"]
export type AuthenticatePasswordSimulator = AuthenticatePasswordRemoteTypes["simulator"]
