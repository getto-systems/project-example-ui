import { DelayTime, WaitTime } from "../config/infra"
import { DelayedHandler, WaitContent } from "./infra"

export async function delayedChecker<T>(
    promise: Promise<T>,
    time: DelayTime,
    handler: DelayedHandler,
): Promise<T> {
    // winner のチェックのため、実行ごとに新しいオブジェクトを作成する必要がある
    const DELAYED_MARKER = { DELAYED: true }

    const winner = await Promise.race([
        promise,
        ticker({ wait_millisecond: time.delay_millisecond }, () => DELAYED_MARKER),
    ])

    if (winner === DELAYED_MARKER) {
        handler()
    }

    return await promise
}

export function ticker<T>(time: WaitTime, content: WaitContent<T>): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(content()), time.wait_millisecond)
    })
}
