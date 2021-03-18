import { mockNotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/mock"
import { mockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"

import { DocsResource } from "./resource"

export function mockDocsResource(): DocsResource {
    return {
        ...mockNotifyUnexpectedErrorResource(),
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
    }
}
