import { ApiCredential } from "../../../../../common/auth/apiCredential/data"
import { Delayed } from "../../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../../z_infra/time/infra"
import { AuthCredential } from "../../../authCredential/common/data"

import { ResetFields, ResetToken, SubmitRemoteError } from "./data"

import { SubmitPod } from "./action"

export type RegisterActionInfra = SubmitInfra

export interface Submit {
    (infra: SubmitInfra): SubmitPod
}

export type SubmitInfra = Readonly<{
    reset: RegisterRemoteAccess
    config: SubmitConfig
    delayed: Delayed
}>
export type SubmitConfig = Readonly<{
    delay: DelayTime
}>

export type RegisterRemoteAccess = RemoteAccess<
    RegisterRemoteMessage,
    RegisterRemoteResponse,
    SubmitRemoteError
>
export type RegisterRemoteAccessResult = RemoteAccessResult<RegisterRemoteResponse, SubmitRemoteError>
export type RegisterSimulator = RemoteAccessSimulator<
    RegisterRemoteMessage,
    RegisterRemoteResponse,
    SubmitRemoteError
>
export type RegisterRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>

export type RegisterRemoteMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetFields
}>
