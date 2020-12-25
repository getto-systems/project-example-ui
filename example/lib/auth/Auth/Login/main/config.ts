import { env } from "../../../../y_static/env"
import { ApplicationActionConfig } from "../../../common/application/infra"
import { PasswordLoginActionConfig } from "../../../login/passwordLogin/infra"
import { RenewActionConfig, SetContinuousRenewActionConfig } from "../../../login/renew/infra"
import {
    PasswordResetActionConfig,
    PasswordResetSessionActionConfig,
} from "../../../profile/passwordReset/infra"

export function newApplicationActionConfig(): ApplicationActionConfig {
    return {
        secureScriptPath: {
            secureServerHost: env.secureServerHost,
        },
    }
}

export function newRenewActionConfig(): RenewActionConfig {
    return {
        renew: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
export function newSetContinuousRenewActionConfig(): SetContinuousRenewActionConfig {
    return {
        setContinuousRenew: { delay: delayMinute(1), interval: intervalMinute(2) },
    }
}

export function newPasswordLoginActionConfig(): PasswordLoginActionConfig {
    return {
        login: {
            delay: delaySecond(1),
        },
    }
}

export function newPasswordResetSessionActionConfig(): PasswordResetSessionActionConfig {
    return {
        startSession: {
            delay: delaySecond(1),
        },
        checkStatus: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
    }
}

export function newPasswordResetActionConfig(): PasswordResetActionConfig {
    return {
        reset: {
            delay: delaySecond(1),
        },
    }
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
