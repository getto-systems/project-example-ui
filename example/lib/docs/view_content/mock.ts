import { mockNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/mock"
import { standard_MockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"
import { mockLoadDocsContentPathResource } from "../action_load_content/mock"

import { DocsContentResource } from "./entry_point"

export function mockDocsContentResource(): DocsContentResource {
    return {
        ...mockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...mockLoadDocsContentPathResource(),
    }
}
