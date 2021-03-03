import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthInfo } from "../../../kernel/authInfo/kernel/data"

import { ResetFields, ResetRemoteError } from "./data"
import { ResetToken } from "../kernel/data"

export type ResetInfra = Readonly<{
    reset: ResetRemote
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type ResetRemote = Remote<ResetMessage, AuthInfo, ResetRemoteError>
export type ResetResult = RemoteResult<AuthInfo, ResetRemoteError>
export type ResetSimulator = RemoteSimulator<ResetMessage, AuthInfo, ResetRemoteError>
export type ResetMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetFields
}>
