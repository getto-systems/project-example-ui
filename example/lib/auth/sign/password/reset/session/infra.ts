import { Delayed, Wait } from "../../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../../z_infra/remote/infra"
import { DelayTime, Limit, WaitTime } from "../../../../../z_infra/time/infra"

import { CheckStatusPod, StartSessionPod } from "./action"

import {
    CheckStatusRemoteError,
    Destination,
    SendingStatus,
    SessionID,
    StartSessionFields,
    StartSessionRemoteError,
} from "./data"

export type SessionActionInfra = StartSessionInfra & CheckStatusInfra

export type StartSessionInfra = Readonly<{
    startSession: StartSessionRemoteAccess
    config: Readonly<{ startSession: StartSessionConfig }>
    delayed: Delayed
}>
export type StartSessionConfig = Readonly<{
    delay: DelayTime
}>

export type CheckStatusInfra = Readonly<{
    sendToken: SendTokenRemoteAccess
    getStatus: GetStatusRemoteAccess
    config: Readonly<{ checkStatus: CheckStatusConfig }>
    wait: Wait
}>
export type CheckStatusConfig = Readonly<{
    wait: WaitTime
    limit: Limit
}>

export interface StartSession {
    (infra: StartSessionInfra): StartSessionPod
}
export interface CheckStatus {
    (infra: CheckStatusInfra): CheckStatusPod
}

export type StartSessionRemoteAccess = RemoteAccess<
    StartSessionFields,
    SessionID,
    StartSessionRemoteError
>
export type StartSessionRemoteAccessResult = RemoteAccessResult<SessionID, StartSessionRemoteError>
export type StartSessionSimulator = RemoteAccessSimulator<
    StartSessionFields,
    SessionID,
    StartSessionRemoteError
>

export type SendTokenRemoteAccess = RemoteAccess<null, true, CheckStatusRemoteError>
export type SendTokenRemoteAccessResult = RemoteAccessResult<true, CheckStatusRemoteError>
export type SendTokenSimulator = RemoteAccessSimulator<null, true, CheckStatusRemoteError>

export type GetStatusRemoteAccess = RemoteAccess<SessionID, GetStatusResponse, CheckStatusRemoteError>
export type GetStatusRemoteAccessResult = RemoteAccessResult<GetStatusResponse, CheckStatusRemoteError>
export type GetStatusSimulator = RemoteAccessSimulator<
    SessionID,
    GetStatusResponse,
    CheckStatusRemoteError
>

export type GetStatusResponse =
    | Readonly<{ dest: Destination; done: false; status: SendingStatus }>
    | Readonly<{ dest: Destination; done: true; send: false; err: string }>
    | Readonly<{ dest: Destination; done: true; send: true }>
