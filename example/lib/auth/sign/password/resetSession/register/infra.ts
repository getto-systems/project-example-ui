import { ApiCredential } from "../../../../../common/apiCredential/data"
import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../../z_getto/infra/remote/infra"
import { DelayTime } from "../../../../../z_getto/infra/config/infra"
import { AuthnInfo } from "../../../kernel/authnInfo/kernel/data"

import {
    PasswordResetFields,
    PasswordResetToken,
    RegisterPasswordRemoteError,
} from "./data"

export type RegisterPasswordInfra = Readonly<{
    register: RegisterPasswordRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type RegisterPasswordRemote = Remote<
    RegisterPasswordMessage,
    RegisterPasswordResponse,
    RegisterPasswordRemoteError
>
export type RegisterPasswordResult = RemoteResult<
    RegisterPasswordResponse,
    RegisterPasswordRemoteError
>
export type RegisterPasswordSimulator = RemoteSimulator<
    RegisterPasswordMessage,
    RegisterPasswordResponse,
    RegisterPasswordRemoteError
>
export type RegisterPasswordMessage = Readonly<{
    resetToken: PasswordResetToken
    fields: PasswordResetFields
}>
export type RegisterPasswordResponse = Readonly<{
    auth: AuthnInfo // TODO キーを authn にする
    api: ApiCredential // キーを authz にする
}>
