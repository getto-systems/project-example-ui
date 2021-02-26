import { DelayTime, WaitTime } from "../config/infra"

export interface DelayedChecker {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}
export interface Ticker {
    <T>(time: WaitTime, content: WaitContent<T>): Promise<T>
}

export interface DelayedHandler {
    (): void
}
export interface WaitContent<T> {
    (): T
}
