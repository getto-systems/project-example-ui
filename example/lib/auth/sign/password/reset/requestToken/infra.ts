import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { RequestTokenFields, RequestTokenRemoteError } from "./data"
import { ResetSessionID } from "../kernel/data"

export type RequestTokenInfra = Readonly<{
    requestToken: RequestTokenRemotePod
    config: Readonly<{
        delay: DelayTime
    }>
}>

type RequestTokenRemoteTypes = RemoteTypes<
    RequestTokenFields,
    ResetSessionID,
    string,
    RequestTokenRemoteError
>
export type RequestTokenRemotePod = RequestTokenRemoteTypes["pod"]
export type RequestTokenResult = RequestTokenRemoteTypes["result"]
export type RequestTokenSimulator = RequestTokenRemoteTypes["simulator"]
