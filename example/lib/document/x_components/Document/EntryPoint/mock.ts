import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../auth/z_EntryPoint/Outline/breadcrumbList/mock"
import {
    initMockMenuListComponent,
    MenuListMockPropsPasser,
} from "../../../../auth/z_EntryPoint/Outline/menuList/mock"
import { initMockErrorComponent } from "../../../../availability/x_Resource/Error/error/mock"
import { ContentMockPropsPasser, initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

export type DocumentMockPropsPasser = Readonly<{
    menuList: MenuListMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    content: ContentMockPropsPasser
}>
export function newMockDocument(passer: DocumentMockPropsPasser): DocumentEntryPoint {
    return {
        resource: {
            error: initMockErrorComponent(),
            menuList: initMockMenuListComponent(passer.menuList),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            content: initMockContentComponent(passer.content),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
