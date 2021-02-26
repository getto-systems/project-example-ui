import { ApiCredential } from "../../../../common/apiCredential/data"
import { DelayedChecker } from "../../../../z_vendor/getto-application/infra/timer/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../z_vendor/getto-application/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"

import { AuthnInfo } from "../../kernel/authnInfo/kernel/data"

import { AuthenticateFields, AuthenticateRemoteError } from "./data"

export type AuthenticateInfra = Readonly<{
    authenticate: AuthenticateRemote
    delayed: DelayedChecker
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type AuthenticateRemote = Remote<
    AuthenticateFields,
    AuthenticateResponse,
    AuthenticateRemoteError
>
export type AuthenticateResult = RemoteResult<AuthenticateResponse, AuthenticateRemoteError>
export type AuthenticateSimulator = RemoteSimulator<
    AuthenticateFields,
    AuthenticateResponse,
    AuthenticateRemoteError
>
export type AuthenticateResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
