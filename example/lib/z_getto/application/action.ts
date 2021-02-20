export interface ApplicationAction<S> {
    ignite(): void
    addStateHandler(handler: ApplicationStateHandler<S>): void
    removeStateHandler(handler: ApplicationStateHandler<S>): void
    terminate(): void
}

export interface ApplicationStateHandler<S> {
    (state: S): void
}
