import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"
import { AuthTicket } from "../../../auth_ticket/kernel/data"

import { ResetPasswordFields, ResetPasswordRemoteError } from "./data"
import { ResetToken } from "../data"
import { AuthRemoteValue } from "../../../auth_ticket/kernel/infra"
import { Clock } from "../../../../z_vendor/getto-application/infra/clock/infra"

export type ResetPasswordInfra = Readonly<{
    reset: ResetPasswordRemotePod
    clock: Clock
    config: Readonly<{
        takeLongtimeThreshold: DelayTime
    }>
}>

type ResetRemoteTypes = RemoteTypes<
    ResetPasswordMessage,
    AuthTicket,
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
