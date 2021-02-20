import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../z_getto/infra/remote/infra"
import { DelayTime } from "../../../../z_getto/infra/config/infra"

import { AuthnInfo } from "../../kernel/authnInfo/kernel/data"

import { AuthenticatePasswordFields, AuthenticatePasswordRemoteError } from "./data"

export type AuthenticatePasswordInfra = Readonly<{
    login: AuthenticatePasswordRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type AuthenticatePasswordRemote = Remote<
    AuthenticatePasswordFields,
    AuthenticatePasswordResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordResult = RemoteResult<
    AuthenticatePasswordResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordSimulator = RemoteSimulator<
    AuthenticatePasswordFields,
    AuthenticatePasswordResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
