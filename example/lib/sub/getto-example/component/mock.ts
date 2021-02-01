export class MockComponent<T> {
    state: T

    listener: Listener<T> | null = null

    constructor(state: T) {
        this.state = state
    }

    onStateChange(post: Listener<T>): void {
        post(this.state)
        this.listener = post
    }
    terminate(): void {
        this.listener = null
    }
    update(state: T): void {
        if (this.listener) {
            this.listener(state)
        } else {
            this.state = state
        }
    }
}

interface Listener<T> {
    (state: T): void
}
