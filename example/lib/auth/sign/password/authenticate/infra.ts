import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../z_infra/time/infra"

import { AuthnInfo } from "../../authnInfo/common/data"
import { AuthenticatePasswordPod } from "./action"

import { PasswordLoginFields, AuthenticatePasswordRemoteError } from "./data"

export type AuthenticatePasswordActionInfra_legacy = AuthenticatePasswordInfra

export type AuthenticatePasswordInfra = Readonly<{
    login: AuthenticatePasswordRemoteAccess
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export interface AuthenticatePassword {
    (infra: AuthenticatePasswordInfra): AuthenticatePasswordPod
}

export type AuthenticatePasswordRemoteAccess = RemoteAccess<
    PasswordLoginFields,
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemoteAccessResult = RemoteAccessResult<
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordSimulator = RemoteAccessSimulator<
    PasswordLoginFields,
    AuthenticatePasswordRemoteResponse,
    AuthenticatePasswordRemoteError
>
export type AuthenticatePasswordRemoteResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
