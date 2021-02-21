export interface ApplicationStateHandler<S> {
    (state: S): void
}

export interface ApplicationHook {
    (): void
}
