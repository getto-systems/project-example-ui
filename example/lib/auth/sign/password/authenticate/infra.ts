import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../z_infra/time/infra"

import { AuthnInfo } from "../../authnInfo/common/data"

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
