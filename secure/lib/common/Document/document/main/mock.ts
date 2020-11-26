import { newBreadcrumbComponent } from "../../../System/component/breadcrumb/mock"
import { newMenuComponent } from "../../../System/component/menu/mock"

import { newContentComponent } from "../../component/content/mock"

import { DocumentFactory } from "../view"

export function newDocument(): DocumentFactory {
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
