import { MockComponent } from "../../../z_external/mock/component"

import { initBreadcrumb } from "../../../example/shared/Outline/breadcrumb/mock"
import { initMenu } from "../../../example/shared/Outline/menu/mock"
import { initContent } from "../content/mock"

import { DocumentEntryPoint } from "./view"

import {
    BreadcrumbState,
    initialBreadcrumbState,
} from "../../../example/shared/Outline/breadcrumb/component"
import { initialMenuState, MenuState } from "../../../example/shared/Outline/menu/component"
import { ContentState, initialContentState } from "../content/component"

export function newDocument(): DocumentMockEntryPoint {
    const resource = {
        menu: initMenu(initialMenuState),
        breadcrumb: initBreadcrumb(initialBreadcrumbState),
        content: initContent(initialContentState),
    }
    return {
        document: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            menu: update(resource.menu),
            breadcrumb: update(resource.breadcrumb),
            content: update(resource.content),
        },
    }
}

export type DocumentMockEntryPoint = Readonly<{
    document: DocumentEntryPoint
    update: Readonly<{
        menu: Post<MenuState>
        breadcrumb: Post<BreadcrumbState>
        content: Post<ContentState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
