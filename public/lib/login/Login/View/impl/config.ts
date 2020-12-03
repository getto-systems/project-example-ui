import { env } from "../../../../y_static/env"

export function newTimeConfig(): TimeConfig {
    return {
        instantLoadExpireTime: expireMinute(3),
        renewRunDelayTime: delayMinute(1),

        renewDelayTime: delaySecond(0.5),
        renewIntervalTime: intervalMinute(2),

        passwordLoginDelayTime: delaySecond(1),

        passwordResetStartSessionDelayTime: delaySecond(1),
        passwordResetCheckWaitTime: waitSecond(0.25),
        passwordResetCheckLimit: { limit: 40 },

        passwordResetDelayTime: delaySecond(1),
    }
}

export type TimeConfig = Readonly<{
    instantLoadExpireTime: ExpireTime
    renewRunDelayTime: DelayTime

    renewDelayTime: DelayTime
    renewIntervalTime: IntervalTime

    passwordLoginDelayTime: DelayTime

    passwordResetStartSessionDelayTime: DelayTime
    passwordResetCheckWaitTime: WaitTime
    passwordResetCheckLimit: Limit

    passwordResetDelayTime: DelayTime
}>

export function newHostConfig(): HostConfig {
    return {
        secureServerHost: env.secureServerHost,
    }
}

export type HostConfig = {
    secureServerHost: string
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
