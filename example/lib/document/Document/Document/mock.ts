import { initBreadcrumb } from "../../../example/shared/Outline/breadcrumb/mock"
import { initMenu } from "../../../example/shared/Outline/menu/mock"

import { initContent } from "../content/mock"

import { DocumentEntryPointFactory } from "./view"

export function newDocumentAsMock(): DocumentEntryPointFactory {
    return () => {
        return {
            resource: {
                menu: initMenu(),
                breadcrumb: initBreadcrumb(),
                content: initContent(),
            },
            terminate: () => {
                // mock では何もしない
            }
        }
    }
}
