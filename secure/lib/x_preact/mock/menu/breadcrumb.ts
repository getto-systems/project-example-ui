import { packBreadcrumbCategory, packBreadcrumbItem } from "../../../navigation/adapter"

import {
    BreadcrumbComponent,
    BreadcrumbComponentResource,
    BreadcrumbState,
} from "../../../menu/breadcrumb/component"

export function newBreadcrumbComponent(): BreadcrumbComponent {
    return new Component(new Init().loaded())
}

class Init {
    initialBreadcrumb(): BreadcrumbState {
        return { type: "initial-breadcrumb" }
    }
    loaded(): BreadcrumbState {
        return {
            type: "loaded",
            breadcrumbs: [
                {
                    category: packBreadcrumbCategory("MAIN"),
                    items: [
                        packBreadcrumbItem({ label: "ホーム", icon: "lnir lnir-home", href: "/dist/index.html" }),
                    ],
                },
            ]
        }
    }
    error(): BreadcrumbState {
        return { type: "error", err: "SYSTEM ERROR" }
    }
}

class Component implements BreadcrumbComponent {
    state: BreadcrumbState

    constructor(state: BreadcrumbState) {
        this.state = state
    }

    onStateChange(stateChanged: Post<BreadcrumbState>): void {
        stateChanged(this.state)
    }

    init(): BreadcrumbComponentResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
