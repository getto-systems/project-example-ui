import { ApiCredential } from "../../../../../common/apiCredential/data"
import { Delayed } from "../../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../../z_infra/remote/infra"
import { DelayTime } from "../../../../../z_infra/time/infra"
import { AuthCredential } from "../../../authCredential/common/data"

import { PasswordResetFields, PasswordResetToken, SubmitPasswordResetRegisterRemoteError } from "./data"

import { SubmitPasswordResetRegisterPod } from "./action"

export type PasswordResetRegisterActionInfra = SubmitPasswordResetRegisterInfra

export type SubmitPasswordResetRegisterInfra = Readonly<{
    register: SubmitPasswordResetRegisterRemoteAccess
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export interface SubmitPasswordResetRegister {
    (infra: SubmitPasswordResetRegisterInfra): SubmitPasswordResetRegisterPod
}

export type SubmitPasswordResetRegisterRemoteAccess = RemoteAccess<
    SubmitPasswordResetRegisterRemoteMessage,
    SubmitPasswordResetRegisterRemoteResponse,
    SubmitPasswordResetRegisterRemoteError
>
export type SubmitPasswordResetRegisterRemoteAccessResult = RemoteAccessResult<
    SubmitPasswordResetRegisterRemoteResponse,
    SubmitPasswordResetRegisterRemoteError
>
export type SubmitPasswordResetRegisterSimulator = RemoteAccessSimulator<
    SubmitPasswordResetRegisterRemoteMessage,
    SubmitPasswordResetRegisterRemoteResponse,
    SubmitPasswordResetRegisterRemoteError
>
export type SubmitPasswordResetRegisterRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>

export type SubmitPasswordResetRegisterRemoteMessage = Readonly<{
    resetToken: PasswordResetToken
    fields: PasswordResetFields
}>
