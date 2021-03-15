import { mockNotifyUnexpectedErrorResource } from "../../avail/action_notify_unexpected_error/mock"
import { mockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"

import { docs_example } from "../../example/docs"

import { DocsResource } from "./resource"

export function mockDocsContentResource(): DocsResource {
    return {
        ...mockNotifyUnexpectedErrorResource(),
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
        docs: { title: "Docs", contents: [[docs_example]] },
    }
}