import { MockComponent } from "../../../sub/getto-example/component/mock"

import { initBreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/mock"
import { initMenuListComponent } from "../../../auth/Outline/menuList/mock"
import { initContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./view"

import {
    BreadcrumbListState,
    initialBreadcrumbListState,
} from "../../../auth/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../../auth/Outline/menuList/component"
import { ContentState, initialContentState } from "../content/component"

export function newDocument(): DocumentMockEntryPoint {
    const resource = {
        menuList: initMenuListComponent(initialMenuListState),
        breadcrumbList: initBreadcrumbListComponent(initialBreadcrumbListState),
        content: initContentComponent(initialContentState),
    }
    return {
        document: {
            resource,
            terminate: () => {
                // mock では特に何もしない
            },
        },
        update: {
            menuList: update(resource.menuList),
            breadcrumbList: update(resource.breadcrumbList),
            content: update(resource.content),
        },
    }
}

export type DocumentMockEntryPoint = Readonly<{
    document: DocumentEntryPoint
    update: Readonly<{
        menuList: Post<MenuListState>
        breadcrumbList: Post<BreadcrumbListState>
        content: Post<ContentState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
