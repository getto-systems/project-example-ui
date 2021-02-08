import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockBreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent } from "../../../auth/Outline/menuList/mock"
import { initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

import {
    BreadcrumbListState,
    initialBreadcrumbListState,
} from "../../../auth/Outline/breadcrumbList/component"
import { initialMenuListState, MenuListState } from "../../../auth/Outline/menuList/component"
import { ContentState, initialContentState } from "../content/component"

export function newMockDocument(): DocumentMockEntryPoint {
    const resource = {
        menuList: initMockMenuListComponent(initialMenuListState),
        breadcrumbList: initMockBreadcrumbListComponent(initialBreadcrumbListState),
        content: initMockContentComponent(initialContentState),
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
