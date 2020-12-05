import { env } from "../../../../y_static/env"
import { SecureScriptPathHostConfig } from "../../../common/application/infra"
import { LoginTimeConfig } from "../../../login/password_login/infra"
import { RenewTimeConfig, SetContinuousRenewTimeConfig } from "../../../login/renew/infra"
import {
    CheckStatusTimeConfig,
    ResetTimeConfig,
    StartSessionTimeConfig,
} from "../../../profile/password_reset/infra"

export function newTimeConfig(): TimeConfig {
    return {
        renew: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
        setContinuousRenew: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
        login: {
            delay: delaySecond(1),
        },

        startSession: {
            delay: delaySecond(1),
        },
        checkStatus: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
        reset: {
            delay: delaySecond(1),
        },
    }
}

export type TimeConfig = Readonly<{
    renew: RenewTimeConfig
    setContinuousRenew: SetContinuousRenewTimeConfig

    login: LoginTimeConfig

    startSession: StartSessionTimeConfig
    checkStatus: CheckStatusTimeConfig
    reset: ResetTimeConfig
}>

export function newHostConfig(): HostConfig {
    return {
        secureScriptPath: {
            secureServerHost: env.secureServerHost,
        },
    }
}

export type HostConfig = {
    secureScriptPath: SecureScriptPathHostConfig
}

type ExpireTime = { expire_millisecond: number }
function expireSecond(second: number): ExpireTime {
    return { expire_millisecond: second * 1000 }
}
function expireMinute(minute: number): ExpireTime {
    return expireSecond(minute * 60)
}

type DelayTime = { delay_millisecond: number }
function delaySecond(second: number): DelayTime {
    return { delay_millisecond: second * 1000 }
}
function delayMinute(minute: number): DelayTime {
    return delaySecond(minute * 60)
}

type IntervalTime = { interval_millisecond: number }
function intervalSecond(second: number): IntervalTime {
    return { interval_millisecond: second * 1000 }
}
function intervalMinute(minute: number): IntervalTime {
    return intervalSecond(minute * 60)
}

type WaitTime = { wait_millisecond: number }
function waitSecond(second: number): WaitTime {
    return { wait_millisecond: second * 1000 }
}

type Limit = { limit: number }
function limit(count: number): Limit {
    return { limit: count }
}
