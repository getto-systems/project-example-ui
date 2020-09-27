export function newTimeConfig(): TimeConfig {
    return {
        instantLoadExpireTime: expireMinute(3),
        renewRunDelayTime: delayMinute(1),

        renewDelayTime: delaySecond(0.5),
        renewIntervalTime: intervalMinute(2),

        passwordLoginDelayTime: delaySecond(1),

        passwordResetStartSessionDelayTime: delaySecond(1),
        passwordResetPollingWaitTime: waitSecond(0.25),
        passwordResetPollingLimit: { limit: 40 },

        passwordResetDelayTime: delaySecond(1),
    }
}

export type TimeConfig = Readonly<{
    instantLoadExpireTime: ExpireTime
    renewRunDelayTime: DelayTime

    renewDelayTime: DelayTime,
    renewIntervalTime: IntervalTime,

    passwordLoginDelayTime: DelayTime,

    passwordResetStartSessionDelayTime: DelayTime,
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,

    passwordResetDelayTime: DelayTime,
}>

type ExpireTime = { expire_milli_second: number }
function expireSecond(second: number): ExpireTime {
    return { expire_milli_second: second * 1000 }
}
function expireMinute(minute: number): ExpireTime {
    return expireSecond(minute * 60)
}

type DelayTime = { delay_milli_second: number }
function delaySecond(second: number): DelayTime {
    return { delay_milli_second: second * 1000 }
}
function delayMinute(minute: number): DelayTime {
    return delaySecond(minute * 60)
}

type IntervalTime = { interval_milli_second: number }
function intervalSecond(second: number): IntervalTime {
    return { interval_milli_second: second * 1000 }
}
function intervalMinute(minute: number): IntervalTime {
    return intervalSecond(minute * 60)
}

type WaitTime = { wait_milli_second: number }
function waitSecond(second: number): WaitTime {
    return { wait_milli_second: second * 1000 }
}

type Limit = { limit: number }
