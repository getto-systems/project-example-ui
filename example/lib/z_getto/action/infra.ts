export interface ActionStatePublisher<S> {
    post(state: S): void
    terminate(): void
}

export interface ActionIgniteRunner {
    register(hook: ActionIgniteHook): void
    ignite(): void
    terminate(): void
}
export interface ActionIgniteHook {
    (): void
}

export interface ActionTerminateRunner {
    register(hook: ActionTerminateHook): void
    terminate(): void
}
export interface ActionTerminateHook {
    (): void
}
