import { DelayTime, WaitTime } from "../time/infra"

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}
export interface Wait {
    <T>(time: WaitTime, content: WaitContent<T>): Promise<T>
}

export interface DelayedHandler {
    (): void
}
export interface WaitContent<T> {
    (): T
}
