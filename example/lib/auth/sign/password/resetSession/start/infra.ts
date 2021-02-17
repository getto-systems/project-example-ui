import { Delayed, Wait } from "../../../../../z_infra/delayed/infra"
import {
    Remote,
    RemoteResult,
    RemoteSimulator,
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

export type StartPasswordResetSessionSessionRemoteAccess = Remote<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionRemoteAccessResult = RemoteResult<
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionSimulator = RemoteSimulator<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>

export type SendPasswordResetSessionTokenRemoteAccess = Remote<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenRemoteAccessResult = RemoteResult<
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenSimulator = RemoteSimulator<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusRemoteAccess = Remote<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusRemoteAccessResult = RemoteResult<
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusSimulator = RemoteSimulator<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusResponse =
    | Readonly<{ dest: PasswordResetDestination; done: false; status: PasswordResetSendingStatus }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: true }>
