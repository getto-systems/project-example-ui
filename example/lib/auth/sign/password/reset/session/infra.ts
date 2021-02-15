import { Delayed, Wait } from "../../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../../z_infra/remote/infra"
import { DelayTime, Limit, WaitTime } from "../../../../../z_infra/time/infra"

import { CheckPasswordResetSessionStatusPod, StartPasswordResetSessionPod } from "./action"

import {
    CheckPasswordResetSessionStatusRemoteError,
    PasswordResetDestination,
    PasswordResetSendingStatus,
    PasswordResetSessionID,
    PasswordResetSessionFields,
    StartPasswordResetSessionRemoteError,
} from "./data"

export type PasswordResetSessionSessionActionInfra = StartPasswordResetSessionInfra &
    CheckPasswordResetSessionStatusInfra

export type StartPasswordResetSessionInfra = Readonly<{
    start: StartPasswordResetSessionSessionRemoteAccess
    delayed: Delayed
    config: Readonly<{
        start: Readonly<{
            delay: DelayTime
        }>
    }>
}>

export type CheckPasswordResetSessionStatusInfra = Readonly<{
    sendToken: SendPasswordResetSessionTokenRemoteAccess
    getStatus: GetPasswordResetSessionStatusRemoteAccess
    wait: Wait
    config: Readonly<{
        checkStatus: Readonly<{
            wait: WaitTime
            limit: Limit
        }>
    }>
}>

export interface StartPasswordResetSession {
    (infra: StartPasswordResetSessionInfra): StartPasswordResetSessionPod
}
export interface CheckPasswordResetSessionStatus {
    (infra: CheckPasswordResetSessionStatusInfra): CheckPasswordResetSessionStatusPod
}

export type StartPasswordResetSessionSessionRemoteAccess = RemoteAccess<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionRemoteAccessResult = RemoteAccessResult<
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionSimulator = RemoteAccessSimulator<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>

export type SendPasswordResetSessionTokenRemoteAccess = RemoteAccess<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenRemoteAccessResult = RemoteAccessResult<
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenSimulator = RemoteAccessSimulator<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusRemoteAccess = RemoteAccess<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusRemoteAccessResult = RemoteAccessResult<
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusSimulator = RemoteAccessSimulator<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusResponse =
    | Readonly<{ dest: PasswordResetDestination; done: false; status: PasswordResetSendingStatus }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: true }>
