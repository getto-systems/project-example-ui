import { BreadcrumbActionSet, BreadcrumbComponent, BreadcrumbState } from "./component"

import { LoadBreadcrumbEvent } from "../../menu/data"

export function initBreadcrumb(actions: BreadcrumbActionSet): BreadcrumbComponent {
    return new Component(actions)
}

class Component implements BreadcrumbComponent {
    actions: BreadcrumbActionSet

    listener: Post<BreadcrumbState>[] = []

    constructor(actions: BreadcrumbActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<BreadcrumbState>): void {
        this.listener.push(post)
    }
    post(state: BreadcrumbState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        this.actions.loadBreadcrumb((event) => {
            this.post(this.mapLoadBreadcrumbEvent(event))
        })
    }

    mapLoadBreadcrumbEvent(event: LoadBreadcrumbEvent): BreadcrumbState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
