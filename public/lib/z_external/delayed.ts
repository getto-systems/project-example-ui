export async function delayed<T>(promise: Promise<T>, time: DelayTime, delayTimeExceeded: DelayedHandler): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }

    const winner = await Promise.race([
        promise,
        wait({ wait_milli_second: time.delay_milli_second }, () => DELAYED_MARKER),
    ])

    if (winner === DELAYED_MARKER) {
        delayTimeExceeded()
    }

    return await promise
}

type DelayTime = Readonly<{ delay_milli_second: number }>

interface DelayedHandler {
    (): void
}

export function wait<T>(time: WaitTime, content: WaitContent<T>): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(content())
        }, time.wait_milli_second)
    })
}

type WaitTime = Readonly<{ wait_milli_second: number }>

interface WaitContent<T> {
    (): T
}
