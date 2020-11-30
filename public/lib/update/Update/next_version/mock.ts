import { NextVersionComponent, NextVersionState } from "./component"

export function initNextVersion(): NextVersionComponent {
    return new Component(new NextVersionStateFactory().initialNextVersion())
}

class NextVersionStateFactory {
    initialNextVersion(): NextVersionState {
        return { type: "initial-next-version" }
    }
}

class Component implements NextVersionComponent {
    state: NextVersionState

    constructor(state: NextVersionState) {
        this.state = state
    }

    onStateChange(post: Post<NextVersionState>): void {
        post(this.state)
    }
    find(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
