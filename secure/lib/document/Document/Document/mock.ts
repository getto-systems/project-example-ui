import { initBreadcrumb } from "../../../common/Outline/breadcrumb/mock"
import { initMenu } from "../../../common/Outline/menu/mock"

import { initContent } from "../content/mock"

import { DocumentFactory } from "./view"

export function newDocumentAsMock(): DocumentFactory {
    return () => {
        return {
            components: {
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
