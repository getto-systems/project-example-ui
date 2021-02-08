import { MockComponent } from "../../../sub/getto-example/application/mock"

import { initMockBreadcrumbListComponent } from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent } from "../../../auth/Outline/menuList/mock"
import { initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

import {
    BreadcrumbListComponentState,
    initialBreadcrumbListComponentState,
} from "../../../auth/Outline/breadcrumbList/component"
import { initialMenuListComponentState, MenuListComponentState } from "../../../auth/Outline/menuList/component"
import { ContentComponentState, initialContentComponentState } from "../content/component"

export function newMockDocument(): DocumentMockEntryPoint {
    const resource = {
        menuList: initMockMenuListComponent(initialMenuListComponentState),
        breadcrumbList: initMockBreadcrumbListComponent(initialBreadcrumbListComponentState),
        content: initMockContentComponent(initialContentComponentState),
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
        menuList: Post<MenuListComponentState>
        breadcrumbList: Post<BreadcrumbListComponentState>
        content: Post<ContentComponentState>
    }>
}>

function update<S, C extends MockComponent<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
