import { initBreadcrumbComponent } from "../../../example/shared/Outline/breadcrumb/mock"
import { initMenu } from "../../../example/shared/Outline/menu/mock"

import { initContent } from "../content/mock"

import { DocumentEntryPoint } from "./view"

export function newDocumentAsMock(): DocumentEntryPoint {
    return {
        resource: {
            menu: initMenu(),
            breadcrumb: initBreadcrumbComponent(),
            content: initContent(),
        },
        terminate: () => {
            // mock では何もしない
        },
    }
}
