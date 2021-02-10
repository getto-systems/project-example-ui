import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import {
    BreadcrumbListMockPasser,
    initMockBreadcrumbListComponent,
} from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent, MenuListMockPasser } from "../../../auth/Outline/menuList/mock"
import { initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

import { ContentComponentState, initialContentComponentState } from "../content/component"

export type DocumentMockPasser = Readonly<{
    menuList: MenuListMockPasser
    breadcrumbList: BreadcrumbListMockPasser
}>
export function newMockDocument(passer: DocumentMockPasser): DocumentMockEntryPoint {
    const resource = {
        menuList: initMockMenuListComponent(passer.menuList),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
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
            content: update(resource.content),
        },
    }
}

export type DocumentMockEntryPoint = Readonly<{
    document: DocumentEntryPoint
    update: Readonly<{
        content: Post<ContentComponentState>
    }>
}>

function update<S, C extends MockComponent_legacy<S>>(component: C): Post<S> {
    return (state) => component.update(state)
}

interface Post<T> {
    (state: T): void
}
