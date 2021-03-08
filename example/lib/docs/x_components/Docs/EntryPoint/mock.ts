import { initMockNotifyUnexpectedErrorCoreAction } from "../../../../avail/action_unexpected_error/core/mock"
import { initNotifyUnexpectedErrorResource } from "../../../../avail/action_unexpected_error/impl"
import {
    initMockLoadBreadcrumbListCoreAction,
    standard_MockBreadcrumbList,
} from "../../../../outline/menu/action_load_breadcrumb_list/core/mock"
import {
    initMockLoadMenuCoreAction,
    standard_MockMenu,
} from "../../../../outline/menu/action_load_menu/core/mock"
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
