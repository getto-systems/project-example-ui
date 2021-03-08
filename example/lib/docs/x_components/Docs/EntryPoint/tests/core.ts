import { DocumentFactory, initDocumentResource } from "../impl/core"

import { initContentComponent } from "../../content/impl"

import { DocumentResource } from "../entryPoint"
import { initTestContentAction } from "../../../../content/tests/content"
import { initLoadContentLocationDetecter } from "../../../../content/testHelper"
import { standard_MockLoadBreadcrumbListResource } from "../../../../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../../../../outline/menu/action_load_menu/mock"
import { standard_MockNotifyUnexpectedErrorResource } from "../../../../../avail/action_unexpected_error/mock"

export function newTestDocumentResource(version: string, currentURL: URL): DocumentResource {
    const factory: DocumentFactory = {
        actions: {
            content: initTestContentAction(),
        },
        components: {
            content: initContentComponent,
        },
    }

    return initDocumentResource(
        factory,
        {
            content: initLoadContentLocationDetecter(currentURL, version),
        },
        standard_MockLoadBreadcrumbListResource(),
        standard_MockLoadMenuResource(),
        standard_MockNotifyUnexpectedErrorResource(),
    )
}
