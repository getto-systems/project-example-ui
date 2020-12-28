import { Delayed } from "../../z_infra/delayed/infra"
import { DelayTime } from "../../z_infra/time/infra"

import { CheckError, Version } from "./data"

export type NextVersionActionConfig = Readonly<{
    find: FindConfig
}>

export type FindInfra = Readonly<{
    config: FindConfig
    check: CheckClient
    delayed: Delayed
}>

export type FindConfig = Readonly<{
    delay: DelayTime
}>

export interface CheckClient {
    check(version: Version): Promise<CheckResponse>
}

export type CheckResponse =
    | Readonly<{ success: false; err: CheckError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true, version: Version }>
