import { newBreadcrumbComponent } from "../../Outline/breadcrumb/mock"
import { newMenuComponent } from "../../Outline/menu/mock"

import { newContentComponent } from "../content/mock"

import { DocumentFactory } from "./view"

export function newDocumentAsMock(): DocumentFactory {
    return () => {
        return {
            components: {
                menu: newMenuComponent(),
                breadcrumb: newBreadcrumbComponent(),
                content: newContentComponent(),
            },
            terminate: () => {
                // mock では何もしない
            }
        }
    }
}
