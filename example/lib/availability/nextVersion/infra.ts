import { RemoteTypes } from "../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../z_vendor/getto-application/infra/config/infra"

import { CheckRemoteError } from "./data"

export type NextVersionActionConfig = Readonly<{
    find: FindConfig
}>

export type FindInfra = Readonly<{
    config: FindConfig
    check: CheckDeployExistsRemote
}>

export type FindConfig = Readonly<{
    delay: DelayTime
}>

type CheckDeployExistsRemoteTypes = RemoteTypes<
    CheckDeployExistsURL,
    CheckDeployExistsResponse,
    CheckRemoteError
>
export type CheckDeployExistsRemote = CheckDeployExistsRemoteTypes["remote"]
export type CheckDeployExistsRemoteResult = CheckDeployExistsRemoteTypes["result"]
export type CheckDeployExistsSimulator = CheckDeployExistsRemoteTypes["simulator"]

export type CheckDeployExistsURL = string
export type CheckDeployExistsResponse = Readonly<{ found: boolean }>
