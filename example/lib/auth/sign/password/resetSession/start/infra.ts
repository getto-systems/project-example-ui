import { Delayed, Wait } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { DelayTime, Limit, WaitTime } from "../../../../../z_getto/infra/config/infra"

import {
    CheckPasswordResetSessionStatusRemoteError,
    PasswordResetDestination,
    PasswordResetSendingStatus,
    PasswordResetSessionID,
    PasswordResetSessionFields,
    StartPasswordResetSessionRemoteError,
} from "./data"

export type StartPasswordResetSessionInfra = Readonly<{
    start: StartPasswordResetSessionSessionRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type CheckPasswordResetSessionStatusInfra = Readonly<{
    sendToken: SendPasswordResetSessionTokenRemote
    getStatus: GetPasswordResetSessionStatusRemote
    wait: Wait
    config: Readonly<{
        wait: WaitTime
        limit: Limit
    }>
}>

export type StartPasswordResetSessionSessionRemote = Remote<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionResult = RemoteResult<
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>
export type StartPasswordResetSessionSessionSimulator = RemoteSimulator<
    PasswordResetSessionFields,
    PasswordResetSessionID,
    StartPasswordResetSessionRemoteError
>

export type SendPasswordResetSessionTokenRemote = Remote<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenResult = RemoteResult<
    true,
    CheckPasswordResetSessionStatusRemoteError
>
export type SendPasswordResetSessionTokenSimulator = RemoteSimulator<
    null,
    true,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusRemote = Remote<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusResult = RemoteResult<
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>
export type GetPasswordResetSessionStatusSimulator = RemoteSimulator<
    PasswordResetSessionID,
    GetPasswordResetSessionStatusResponse,
    CheckPasswordResetSessionStatusRemoteError
>

export type GetPasswordResetSessionStatusResponse =
    | Readonly<{
          dest: PasswordResetDestination
          done: false
          status: PasswordResetSendingStatus
      }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: PasswordResetDestination; done: true; send: true }>
