import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../z_infra/time/infra"

import { AuthnInfo } from "../../authnInfo/common/data"

import { AuthenticatePasswordFields, AuthenticatePasswordRemoteError } from "./data"

export type AuthenticatePasswordInfra = Readonly<{
    login: AuthenticatePasswordRemoteAccess
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type AuthenticatePasswordRemoteAccess = RemoteAccess<
    AuthenticatePasswordFields,
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemoteAccessResult = RemoteAccessResult<
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordSimulator = RemoteAccessSimulator<
    AuthenticatePasswordFields,
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemoteResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
