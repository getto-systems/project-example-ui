import { ApplicationHook, ApplicationStateHandler } from "./data"

export interface StateHandler<S> {
    post(state: S): void

    add(handler: ApplicationStateHandler<S>): void
    remove(target: ApplicationStateHandler<S>): void
    removeAll(): void
}

export interface IgniteHook {
    register(hook: ApplicationHook): void
    run(): void
}

export interface TerminateHook {
    register(hook: ApplicationHook): void
    run(): void
}
