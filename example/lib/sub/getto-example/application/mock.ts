import { ApplicationComponent, ApplicationStateHandler } from "./component"

export class MockComponent<S> implements ApplicationComponent<S> {
    state: S

    handler: ApplicationStateHandler<S> | null = null

    constructor(state: S) {
        this.state = state
    }

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        handler(this.state)
        this.handler = handler
    }
    removeStateHandler(_handler: ApplicationStateHandler<S>): void {
        this.handler = null
    }
    terminate(): void {
        this.handler = null
    }

    update(state: S): void {
        if (this.handler) {
            this.handler(state)
        } else {
            this.state = state
        }
    }
}
