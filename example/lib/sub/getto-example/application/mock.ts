export class MockComponent<S> {
    state: S

    handler: Handler<S> | null = null

    constructor(state: S) {
        this.state = state
    }

    addStateHandler(handler: Handler<S>): void {
        handler(this.state)
        this.handler = handler
    }
    removeStateHandler(_handler: Handler<S>): void {
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

interface Handler<T> {
    (state: T): void
}
