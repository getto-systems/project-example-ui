import { DelayTime, WaitTime } from "../time/infra"
import { DelayedHandler, WaitContent } from "./infra"

export async function delayed<T>(
    promise: Promise<T>,
    time: DelayTime,
    delayTimeExceeded: DelayedHandler
): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }

    const winner = await Promise.race([
        promise,
        wait({ wait_millisecond: time.delay_millisecond }, () => DELAYED_MARKER),
    ])

    if (winner === DELAYED_MARKER) {
        delayTimeExceeded()
    }

    return await promise
}

export function wait<T>(time: WaitTime, content: WaitContent<T>): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(content())
        }, time.wait_millisecond)
    })
}
