import { ContentComponent, ContentState } from "./component"

export function initContent(): ContentComponent {
    return new Component()
}

class Component implements ContentComponent {
    listener: Post<ContentState>[] = []

    onStateChange(post: Post<ContentState>): void {
        this.listener.push(post)
    }
    post(state: ContentState): void {
        this.listener.forEach((post) => post(state))
    }
}

interface Post<T> {
    (state: T): void
}
