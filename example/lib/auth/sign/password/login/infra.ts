import { ApiCredential } from "../../../../common/apiCredential/data"
import { Delayed } from "../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../z_infra/time/infra"

import { AuthCredential } from "../../authCredential/common/data"
import { SubmitPasswordLoginPod } from "./action"

import { PasswordLoginFields, SubmitPasswordLoginRemoteError } from "./data"

export type PasswordLoginActionInfra = SubmitPasswordLoginInfra

export type SubmitPasswordLoginInfra = Readonly<{
    login: SubmitPasswordLoginRemoteAccess
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export interface SubmitPasswordLogin {
    (infra: SubmitPasswordLoginInfra): SubmitPasswordLoginPod
}

export type SubmitPasswordLoginRemoteAccess = RemoteAccess<
    PasswordLoginFields,
    SubmitPasswordLoginRemoteResponse,
    SubmitPasswordLoginRemoteError
>
export type SubmitLoginRemoteAccessResult = RemoteAccessResult<
    SubmitPasswordLoginRemoteResponse,
    SubmitPasswordLoginRemoteError
>
export type SubmitPasswordLoginSimulator = RemoteAccessSimulator<
    PasswordLoginFields,
    SubmitPasswordLoginRemoteResponse,
    SubmitPasswordLoginRemoteError
>
export type SubmitPasswordLoginRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>
