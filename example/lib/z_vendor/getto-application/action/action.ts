export type ApplicationView<R> = Readonly<{
    resource: R
    terminate: { (): void }
}>

export interface ApplicationAction {
    terminate(): void
}
export interface ApplicationStateAction<S> extends ApplicationAction {
    readonly initialState: S
    readonly subscriber: ApplicationActionStateSubscriber<S>
    ignite(): void
}

export interface ApplicationActionStateSubscriber<S> {
    subscribe(handler: ApplicationActionStateHandler<S>): void
    unsubscribe(target: ApplicationActionStateHandler<S>): void
}
export interface ApplicationActionStateHandler<S> {
    (state: S): void
}
