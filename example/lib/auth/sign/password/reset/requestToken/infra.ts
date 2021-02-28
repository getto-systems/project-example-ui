import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { RequestTokenFields, RequestTokenRemoteError } from "./data"

export type RequestTokenInfra = Readonly<{
    requestToken: RequestTokenRemote
    config: Readonly<{
        delay: DelayTime
    }>
}>

type RequestTokenRemoteTypes = RemoteTypes<
    RequestTokenFields,
    string,
    RequestTokenRemoteError
>
export type RequestTokenRemote = RequestTokenRemoteTypes["remote"]
export type RequestTokenResult = RequestTokenRemoteTypes["result"]
export type RequestTokenSimulator = RequestTokenRemoteTypes["simulator"]
