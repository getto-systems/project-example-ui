import { ApplicationAction, ApplicationStateHandler } from "./action"

export class ApplicationAbstractAction<S> implements ApplicationAction<S> {
    handlers: ApplicationStateHandler<S>[] = []

    igniteHooks: ApplicationHook[] = []
    terminateHooks: ApplicationHook[] = []

    igniteHook(hook: ApplicationHook): void {
        this.igniteHooks = [...this.igniteHooks, hook]
    }
    ignite(): void {
        this.igniteHooks.forEach((hook) => hook())
    }

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }

    post(state: S): void {
        this.handlers.forEach((post) => post(state))
    }

    terminateHook(hook: ApplicationHook): void {
        this.terminateHooks = [...this.terminateHooks, hook]
    }
    terminate(): void {
        this.handlers = []
        this.terminateHooks.forEach((terminate) => terminate())
    }
}

export interface ApplicationHook {
    (): void
}
