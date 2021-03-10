import { mockNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/mock"
import { standard_MockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"
import { mockLoadSeasonResource } from "../common/action_load_season/mock"

import { BaseResource } from "./entry_point"

export function mockBaseResource(): BaseResource {
    return {
        ...mockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...mockLoadSeasonResource(),
    }
}
