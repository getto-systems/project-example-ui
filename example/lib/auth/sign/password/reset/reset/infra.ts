import { ApiCredential } from "../../../../../common/apiCredential/data"
import { Delayed } from "../../../../../z_vendor/getto-application/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_vendor/getto-application/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"

import { ResetFields, ResetRemoteError } from "./data"
import { ResetToken } from "../kernel/data"

export type ResetInfra = Readonly<{
    reset: ResetRemote
    delayed: Delayed
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
    api: ApiCredential // キーを authz にする
}>
