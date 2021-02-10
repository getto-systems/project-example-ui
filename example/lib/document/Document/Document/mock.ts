import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../auth/Outline/breadcrumbList/mock"
import { initMockMenuListComponent, MenuListMockPropsPasser } from "../../../auth/Outline/menuList/mock"
import { ContentMockPropsPasser, initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

export type DocumentMockPropsPasser = Readonly<{
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    content: ContentMockPropsPasser
}>
export function newMockDocument(passer: DocumentMockPropsPasser): DocumentEntryPoint {
    const resource = {
        menuList: initMockMenuListComponent(passer.menuList),
        breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
        content: initMockContentComponent(passer.content),
    }
    return {
        resource,
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
