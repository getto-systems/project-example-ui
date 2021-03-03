import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"

import { AuthInfo } from "../../kernel/authn/kernel/data"

import { AuthenticateFields, AuthenticateRemoteError } from "./data"

export type AuthenticateInfra = Readonly<{
    authenticate: AuthenticateRemote
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type AuthenticateRemote = Remote<AuthenticateFields, AuthInfo, AuthenticateRemoteError>
export type AuthenticateResult = RemoteResult<AuthInfo, AuthenticateRemoteError>
export type AuthenticateSimulator = RemoteSimulator<
    AuthenticateFields,
    AuthInfo,
    AuthenticateRemoteError
>
