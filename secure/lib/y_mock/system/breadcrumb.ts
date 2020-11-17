import { packBreadcrumbCategory, packBreadcrumbItem } from "../../menu/adapter"

import { BreadcrumbComponent, BreadcrumbState } from "../../system/component/breadcrumb/component"

export function newBreadcrumbComponent(): BreadcrumbComponent {
    return new Component(new BreadcrumbStateFactory().succeedToLoad())
}

class BreadcrumbStateFactory {
    initialBreadcrumb(): BreadcrumbState {
        return { type: "initial-breadcrumb" }
    }
    succeedToLoad(): BreadcrumbState {
        return {
            type: "succeed-to-load",
            breadcrumb: [
                {
                    type: "category",
                    category: packBreadcrumbCategory("MAIN"),
                },
                {
                    type: "item",
                    item: packBreadcrumbItem({
                        label: "ホーム",
                        icon: "home",
                        href: "/dist/index.html",
                    }),
                },
            ],
        }
    }
}

class Component implements BreadcrumbComponent {
    state: BreadcrumbState

    constructor(state: BreadcrumbState) {
        this.state = state
    }

    onStateChange(post: Post<BreadcrumbState>): void {
        post(this.state)
    }

    action() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
