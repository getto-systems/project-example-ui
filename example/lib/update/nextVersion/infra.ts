import { Delayed } from "../../z_infra/delayed/infra"
import { RemoteAccess, RemoteAccessResult } from "../../z_infra/remote/infra"
import { RemoteAccessSimulator } from "../../z_infra/remote/simulate"
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

export type CheckRemoteAccess = RemoteAccess<Version, CheckResponse, CheckRemoteError>
export type CheckRemoteAccessResult = RemoteAccessResult<CheckResponse, CheckRemoteError>
export type CheckSimulator = RemoteAccessSimulator<Version, CheckResponse, CheckRemoteError>

export type CheckResponse = Readonly<{ found: false }> | Readonly<{ found: true; version: Version }>
