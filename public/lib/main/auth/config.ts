export function newTimeConfig(): TimeConfig {
    return {
        renewDelayTime: delaySecond(0.5),
        renewIntervalTime: intervalMinute(2),

        passwordLoginDelayTime: delaySecond(1),

        passwordResetCreateSessionDelayTime: delaySecond(1),
        passwordResetPollingWaitTime: waitSecond(0.25),
        passwordResetPollingLimit: { limit: 40 },

        passwordResetDelayTime: delaySecond(1),
    }
}

type TimeConfig = Readonly<{
    renewDelayTime: DelayTime,
    renewIntervalTime: IntervalTime,

    passwordLoginDelayTime: DelayTime,

    passwordResetCreateSessionDelayTime: DelayTime,
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,

    passwordResetDelayTime: DelayTime,
}>

type DelayTime = { delay_milli_second: number }
function delaySecond(second: number): DelayTime {
    return { delay_milli_second: second * 1000 }
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
