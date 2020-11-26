import { iconClass, lnir } from "../../../../z_external/icon"

import { BreadcrumbComponent, BreadcrumbState } from "./component"

import { markMenuCategory, markMenuItem } from "../../../menu/data"

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
                    category: markMenuCategory({ label: "MAIN" }),
                },
                {
                    type: "item",
                    item: markMenuItem({
                        label: "ホーム",
                        icon: iconClass(lnir("home")),
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

    load() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
