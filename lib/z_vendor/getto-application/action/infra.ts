export interface ApplicationActionStatePublisher<S> {
    post(state: S): S
    terminate(): void
}

export interface ApplicationActionIgniteRunner {
    register(hook: ApplicationActionIgniteHook): void
    ignite(): void
    terminate(): void
}
export interface ApplicationActionIgniteHook {
    (): void
}

export interface ApplicationActionTerminateRunner {
    register(hook: ApplicationActionTerminateHook): void
    terminate(): void
}
export interface ApplicationActionTerminateHook {
    (): void
}
