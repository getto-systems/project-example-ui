import { MockComponent } from "../../../z_external/mock/component"

import { initBreadcrumbListComponent } from "../../../example/Outline/breadcrumbList/mock"
import { initMenuListComponent } from "../../../example/Outline/menuList/mock"
import { initContent } from "../content/mock"

import { DocumentEntryPoint } from "./view"

import {
    BreadcrumbListState,
    initialBreadcrumbListState,
} from "../../../example/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../../example/Outline/menuList/component"
import { ContentState, initialContentState } from "../content/component"

export function newDocument(): DocumentMockEntryPoint {
    const resource = {
        menuList: initMenuListComponent(initialMenuListState),
        breadcrumbList: initBreadcrumbListComponent(initialBreadcrumbListState),
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
