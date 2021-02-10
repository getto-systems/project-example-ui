import { Delayed, Wait } from "../../../z_infra/delayed/infra"
import { RemoteAccess } from "../../../z_infra/remote/infra"
import { DelayTime, Limit, WaitTime } from "../../../z_infra/time/infra"

import { AuthCredential } from "../../common/credential/data"
import {
    StartSessionFields,
    ResetFields,
    SessionID,
    Destination,
    ResetToken,
    SendingStatus,
    ResetRemoteError,
    CheckStatusRemoteError,
    StartSessionRemoteError,
} from "./data"

export type PasswordResetSessionActionConfig = Readonly<{
    startSession: StartSessionConfig
    checkStatus: CheckStatusConfig
}>

export type StartSessionInfra = Readonly<{
    startSession: StartSessionRemoteAccess
    config: StartSessionConfig
    delayed: Delayed
}>
export type CheckStatusInfra = Readonly<{
    sendToken: SendTokenRemoteAccess
    getStatus: GetStatusRemoteAccess
    config: CheckStatusConfig
    delayed: Delayed
    wait: Wait
}>

export type StartSessionConfig = Readonly<{
    delay: DelayTime
}>

export type CheckStatusConfig = Readonly<{
    wait: WaitTime
    limit: Limit
}>

export type PasswordResetActionConfig = Readonly<{
    reset: ResetConfig
}>

export type ResetInfra = Readonly<{
    reset: ResetRemoteAccess
    config: ResetConfig
    delayed: Delayed
}>

export type ResetConfig = Readonly<{
    delay: DelayTime
}>

export type StartSessionRemoteAccess = RemoteAccess<
    StartSessionFields,
    SessionID,
    StartSessionRemoteError
>
export type SendTokenRemoteAccess = RemoteAccess<null, true, CheckStatusRemoteError>
export type GetStatusRemoteAccess = RemoteAccess<SessionID, GetStatusResponse, CheckStatusRemoteError>

export type GetStatusResponse =
    | Readonly<{ dest: Destination; done: false; status: SendingStatus }>
    | Readonly<{ dest: Destination; done: true; send: false; err: string }>
    | Readonly<{ dest: Destination; done: true; send: true }>

export type ResetRemoteAccess = RemoteAccess<ResetMessage, AuthCredential, ResetRemoteError>

export type ResetMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetFields
}>
