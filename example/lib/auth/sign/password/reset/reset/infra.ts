import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthInfo } from "../../../kernel/auth_info/kernel/data"

import { ResetPasswordFields, ResetPasswordRemoteError } from "./data"
import { ResetToken } from "../kernel/data"
import { AuthRemoteValue } from "../../../kernel/auth_info/kernel/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"

export type ResetPasswordInfra = Readonly<{
    reset: ResetPasswordRemotePod
    clock: Clock
    config: Readonly<{
        delay: DelayTime
    }>
}>

type ResetRemoteTypes = RemoteTypes<
    ResetPasswordMessage,
    AuthInfo,
    AuthRemoteValue,
    ResetPasswordRemoteError
>
export type ResetPasswordRemotePod = ResetRemoteTypes["pod"]
export type ResetPasswordResult = ResetRemoteTypes["result"]
export type ResetPasswordSimulator = ResetRemoteTypes["simulator"]
export type ResetPasswordMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetPasswordFields
}>
