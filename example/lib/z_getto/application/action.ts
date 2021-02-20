export interface ApplicationAction<S> {
    addStateHandler(handler: ApplicationStateHandler<S>): void
    removeStateHandler(handler: ApplicationStateHandler<S>): void
    ignite(): void
    terminate(): void
}

export interface ApplicationStateHandler<S> {
    (state: S): void
}
