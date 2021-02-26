export type ApplicationEntryPoint<R> = Readonly<{
    resource: R
    terminate: { (): void }
}>

export interface ApplicationAction {
    terminate(): void
}
export interface ApplicationStateAction<S> extends ApplicationAction {
    readonly initialState: S
    readonly subscriber: ActionStateSubscriber<S>
    ignite(): void
}

export interface ActionStateSubscriber<S> {
    subscribe(handler: ActionStateHandler<S>): void
    unsubscribe(target: ActionStateHandler<S>): void
}
export interface ActionStateHandler<S> {
    (state: S): void
}
