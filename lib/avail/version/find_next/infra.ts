import { RemoteTypes } from "../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../z_vendor/getto-application/infra/config/infra"

import { CheckDeployExistsRemoteError } from "./data"

export type FindNextVersionInfra = Readonly<{
    version: string
    check: CheckDeployExistsRemotePod
    config: Readonly<{
        takeLongtimeThreshold: DelayTime
    }>
}>

type CheckDeployExistsRemoteTypes = RemoteTypes<
    CheckDeployExistsURL,
    CheckDeployExistsResponse,
    CheckDeployExistsResponse,
    CheckDeployExistsRemoteError
>
export type CheckDeployExistsRemotePod = CheckDeployExistsRemoteTypes["pod"]
export type CheckDeployExistsRemote = CheckDeployExistsRemoteTypes["remote"]
export type CheckDeployExistsRemoteResult = CheckDeployExistsRemoteTypes["result"]
export type CheckDeployExistsSimulator = CheckDeployExistsRemoteTypes["simulator"]

export type CheckDeployExistsURL = string
export type CheckDeployExistsResponse = Readonly<{ found: boolean }>
