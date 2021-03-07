import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../avail/unexpectedError/Action/Core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/impl"
import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import {
    initMockMenuComponent,
    MenuMockPropsPasser,
} from "../../../../common/x_Resource/Outline/Menu/Menu/mock"
import { ContentMockPropsPasser, initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

export type DocumentMockPropsPasser = Readonly<{
    menu: MenuMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    content: ContentMockPropsPasser
}>
export function newMockDocument(passer: DocumentMockPropsPasser): DocumentEntryPoint {
    return {
        resource: {
            ...initNotifyUnexpectedErrorResource(initMockNotifyUnexpectedErrorCoreAction()),
            menu: initMockMenuComponent(passer.menu),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
            content: initMockContentComponent(passer.content),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
