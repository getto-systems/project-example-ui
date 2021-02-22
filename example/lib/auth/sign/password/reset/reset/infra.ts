import { ApiCredential } from "../../../../../common/apiCredential/data"
import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { DelayTime } from "../../../../../z_getto/infra/config/infra"
import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"

import { PasswordResetFields, ResetPasswordRemoteError } from "./data"
import { PasswordResetToken } from "../kernel/data"

export type ResetPasswordInfra = Readonly<{
    reset: ResetPasswordRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type ResetPasswordRemote = Remote<
    ResetPasswordMessage,
    ResetPasswordResponse,
    ResetPasswordRemoteError
>
export type ResetPasswordResult = RemoteResult<ResetPasswordResponse, ResetPasswordRemoteError>
export type ResetPasswordSimulator = RemoteSimulator<
    ResetPasswordMessage,
    ResetPasswordResponse,
    ResetPasswordRemoteError
>
export type ResetPasswordMessage = Readonly<{
    resetToken: PasswordResetToken
    fields: PasswordResetFields
}>
export type ResetPasswordResponse = Readonly<{
    auth: AuthnInfo // TODO キーを authn にする
    api: ApiCredential // キーを authz にする
}>
