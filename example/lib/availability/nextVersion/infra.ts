import { Delayed } from "../../z_infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../z_infra/remote/infra"
import { DelayTime } from "../../z_infra/time/infra"

import { CheckRemoteError, Version } from "./data"

export type NextVersionActionConfig = Readonly<{
    find: FindConfig
}>

export type FindInfra = Readonly<{
    config: FindConfig
    check: CheckRemoteAccess
    delayed: Delayed
}>

export type FindConfig = Readonly<{
    delay: DelayTime
}>

export type CheckRemoteAccess = Remote<Version, CheckResponse, CheckRemoteError>
export type CheckRemoteAccessResult = RemoteResult<CheckResponse, CheckRemoteError>
export type CheckSimulator = RemoteSimulator<Version, CheckResponse, CheckRemoteError>

export type CheckResponse = Readonly<{ found: false }> | Readonly<{ found: true; version: Version }>
