export class MockComponent<T> {
    state: T

    listener: Post<T> | null = null

    constructor(state: T) {
        this.state = state
    }

    onStateChange(post: Post<T>): void {
        post(this.state)
        this.listener = post
    }
    update(state: T): void {
        if (this.listener) {
            this.listener(state)
        } else {
            this.state = state
        }
    }
}

interface Post<T> {
    (state: T): void
}
