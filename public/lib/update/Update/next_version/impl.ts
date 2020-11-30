import { NextVersionActionSet, NextVersionComponent, NextVersionState } from "./component"

import { FindEvent } from "../../next_version/data"

export function initNextVersion(actions: NextVersionActionSet): NextVersionComponent {
    return new Component(actions)
}

class Component implements NextVersionComponent {
    actions: NextVersionActionSet

    listener: Post<NextVersionState>[] = []

    constructor(actions: NextVersionActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<NextVersionState>): void {
        this.listener.push(post)
    }
    post(state: NextVersionState): void {
        this.listener.forEach((post) => post(state))
    }

    find(): void {
        this.actions.find((event) => {
            this.post(this.mapFindEvent(event))
        })
    }

    mapFindEvent(event: FindEvent): NextVersionState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
