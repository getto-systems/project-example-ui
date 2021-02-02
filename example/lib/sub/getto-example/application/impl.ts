import { ApplicationComponent, ApplicationStateHandler } from "./component"

export class ApplicationBaseComponent<S> implements ApplicationComponent<S> {
    handlers: ApplicationStateHandler<S>[] = []

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    post(state: S): void {
        this.handlers.forEach((post) => post(state))
    }

    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }
    terminate(): void {
        this.handlers = []
    }
}
