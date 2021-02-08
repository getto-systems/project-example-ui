import { ApplicationComponent, ApplicationStateHandler } from "./component"

export class ApplicationBaseComponent<S> implements ApplicationComponent<S> {
    handlers: ApplicationStateHandler<S>[] = []
    terminates: ApplicationTerminateHandler[] = []

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }

    post(state: S): void {
        this.handlers.forEach((post) => post(state))
    }

    addTerminateHandler(handler: ApplicationTerminateHandler): void {
        this.handlers = [...this.handlers, handler]
    }
    terminate(): void {
        this.handlers = []
        this.terminates.forEach((terminate) => terminate())
    }
}

export interface ApplicationTerminateHandler {
    (): void
}
