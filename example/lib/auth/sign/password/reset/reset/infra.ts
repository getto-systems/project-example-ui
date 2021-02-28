import { Authz } from "../../../../../common/authz/data"
import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"

import { ResetFields, ResetRemoteError } from "./data"
import { ResetToken } from "../kernel/data"

export type ResetInfra = Readonly<{
    reset: ResetRemote
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type ResetRemote = Remote<ResetMessage, ResetResponse, ResetRemoteError>
export type ResetResult = RemoteResult<ResetResponse, ResetRemoteError>
export type ResetSimulator = RemoteSimulator<ResetMessage, ResetResponse, ResetRemoteError>
export type ResetMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetFields
}>
export type ResetResponse = Readonly<{
    auth: AuthnInfo // TODO キーを authn にする
    api: Authz // キーを authz にする
}>
