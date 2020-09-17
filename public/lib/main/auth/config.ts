export function newTimeConfig(): TimeConfig {
    return {
        renewDelayTime: delaySecond(0.5),

        passwordLoginDelayTime: delaySecond(1),

        passwordResetCreateSessionDelayTime: delaySecond(1),
        passwordResetPollingWaitTime: waitSecond(0.25),
        passwordResetPollingLimit: { limit: 40 },

        passwordResetDelayTime: delaySecond(1),
    }
}

type TimeConfig = Readonly<{
    renewDelayTime: DelayTime,

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

type WaitTime = { wait_milli_second: number }
function waitSecond(second: number): WaitTime {
    return { wait_milli_second: second * 1000 }
}

type Limit = { limit: number }
