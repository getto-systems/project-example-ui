import { MockComponent } from "../../../z_external/mock/component"

import { initBreadcrumb } from "../../../example/shared/Outline/breadcrumbList/mock"
import { initMenu } from "../../../example/shared/Outline/menuList/mock"
import { initContent } from "../content/mock"

import { DocumentEntryPoint } from "./view"

import {
    BreadcrumbListState,
    initialBreadcrumbListState,
} from "../../../example/shared/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../../example/shared/Outline/menuList/component"
import { ContentState, initialContentState } from "../content/component"

export function newDocument(): DocumentMockEntryPoint {
    const resource = {
        menu: initMenu(initialMenuListState),
        breadcrumb: initBreadcrumb(initialBreadcrumbListState),
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
        menu: Post<MenuListState>
        breadcrumb: Post<BreadcrumbListState>
        content: Post<ContentState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
