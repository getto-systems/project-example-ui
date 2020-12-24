import { LoadContentEvent } from "../../content/data"
import { ContentActionSet, ContentComponent, ContentState } from "./component"

export function initContent(actions: ContentActionSet): ContentComponent {
    return new Component(actions)
}

class Component implements ContentComponent {
    actions: ContentActionSet

    listener: Post<ContentState>[] = []

    constructor(actions: ContentActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<ContentState>): void {
        this.listener.push(post)
    }
    post(state: ContentState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.actions.loadDocument((event) => {
            this.post(this.mapLoadDocumentEvent(event))
        })
    }

    mapLoadDocumentEvent(event: LoadContentEvent): ContentState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
