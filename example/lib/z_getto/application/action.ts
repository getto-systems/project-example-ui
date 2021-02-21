import { ApplicationStateHandler } from "./data"

export interface ApplicationAction<S> {
    addStateHandler(handler: ApplicationStateHandler<S>): void
    removeStateHandler(handler: ApplicationStateHandler<S>): void
    ignite(): void
    terminate(): void
}
