import { ApplicationHook, ApplicationStateHandler } from "./data"

export interface StateHandler<S> {
    post(state: S): void

    subscribe(handler: ApplicationStateHandler<S>): void
    unsubscribe(target: ApplicationStateHandler<S>): void
    clear(): void
}

export interface IgniteHook {
    register(hook: ApplicationHook): void
    run(): void
}

export interface TerminateHook {
    register(hook: ApplicationHook): void
    run(): void
}
