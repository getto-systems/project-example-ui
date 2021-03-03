import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthInfo } from "../../../kernel/authInfo/kernel/data"

import { ResetFields, ResetRemoteError } from "./data"
import { ResetToken } from "../kernel/data"
import { AuthRemoteValue } from "../../../kernel/authInfo/kernel/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"

export type ResetInfra = Readonly<{
    reset: ResetRemotePod
    clock: Clock
    config: Readonly<{
        delay: DelayTime
    }>
}>

type ResetRemoteTypes = RemoteTypes<ResetMessage, AuthInfo, AuthRemoteValue, ResetRemoteError>
export type ResetRemotePod = ResetRemoteTypes["pod"]
export type ResetResult = ResetRemoteTypes["result"]
export type ResetSimulator = ResetRemoteTypes["simulator"]
export type ResetMessage = Readonly<{
    resetToken: ResetToken
    fields: ResetFields
}>
