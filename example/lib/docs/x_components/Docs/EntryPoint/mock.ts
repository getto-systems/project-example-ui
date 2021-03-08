import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../avail/unexpectedError/Action/Core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../avail/unexpectedError/Action/impl"
import {
    initMockLoadBreadcrumbListCoreAction,
    standard_MockBreadcrumbList,
} from "../../../../outline/menu/loadBreadcrumbList/Action/Core/mock"
import {
    initMockLoadMenuCoreAction,
    standard_MockMenu,
} from "../../../../outline/menu/loadMenu/Action/Core/mock"
import { ContentMockPropsPasser, initMockContentComponent } from "../content/mock"

import { DocumentEntryPoint } from "./entryPoint"

export type DocumentMockPropsPasser = Readonly<{
    content: ContentMockPropsPasser
}>
export function newMockDocument(passer: DocumentMockPropsPasser): DocumentEntryPoint {
    return {
        resource: {
            ...initNotifyUnexpectedErrorResource(initMockNotifyUnexpectedErrorCoreAction()),
            menu: initMockLoadMenuCoreAction(standard_MockMenu()),
            breadcrumbList: initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList()),
            content: initMockContentComponent(passer.content),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
