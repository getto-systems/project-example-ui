export class BaseComponent<S> {
    listener: Listener<S>[] = []

    onStateChange(post: Listener<S>): void {
        this.listener.push(post)
    }
    post(state: S): void {
        this.listener.forEach((post) => post(state))
    }

    terminate(): void {
        this.listener.splice(0, this.listener.length)
    }
}

interface Listener<T> {
    (state: T): void
}
