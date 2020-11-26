import { ContentComponent, ContentState } from "./component"

export function newContentComponent(): ContentComponent {
    return new Component(new ContentStateFactory().initialContent())
}

class ContentStateFactory {
    initialContent(): ContentState {
        return { type: "initial-content" }
    }
}

class Component implements ContentComponent {
    state: ContentState

    constructor(state: ContentState) {
        this.state = state
    }

    onStateChange(post: Post<ContentState>): void {
        post(this.state)
    }
}

interface Post<T> {
    (state: T): void
}
