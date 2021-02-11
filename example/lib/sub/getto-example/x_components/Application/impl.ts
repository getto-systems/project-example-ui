import { ApplicationComponent, ApplicationStateHandler } from "./component"

export class ApplicationBaseComponent<S> implements ApplicationComponent<S> {
    handlers: ApplicationStateHandler<S>[] = []
    terminates: ApplicationTerminateHook[] = []

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }

    post(state: S): void {
        this.handlers.forEach((post) => post(state))
    }

    terminateHook(hook: ApplicationTerminateHook): void {
        this.terminates = [...this.terminates, hook]
    }
    terminate(): void {
        this.handlers = []
        this.terminates.forEach((terminate) => terminate())
    }
}

export interface ApplicationTerminateHook {
    (): void
}
