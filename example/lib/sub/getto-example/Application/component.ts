export interface ApplicationComponent<S> {
    addStateHandler(handler: ApplicationStateHandler<S>): void
    removeStateHandler(handler: ApplicationStateHandler<S>): void
    terminate(): void
}

export interface ApplicationStateHandler<S> {
    (state: S): void
}
