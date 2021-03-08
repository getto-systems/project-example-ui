import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { RequestResetTokenFields, RequestResetTokenRemoteError } from "./data"
import { ResetSessionID } from "../kernel/data"

export type RequestResetTokenInfra = Readonly<{
    requestToken: RequestResetTokenRemotePod
    config: Readonly<{
        delay: DelayTime
    }>
}>

type RequestResetTokenRemoteTypes = RemoteTypes<
    RequestResetTokenFields,
    ResetSessionID,
    string,
    RequestResetTokenRemoteError
>
export type RequestResetTokenRemotePod = RequestResetTokenRemoteTypes["pod"]
export type RequestResetTokenResult = RequestResetTokenRemoteTypes["result"]
export type RequestResetTokenSimulator = RequestResetTokenRemoteTypes["simulator"]
