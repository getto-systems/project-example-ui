import { standard_MockLogoutResource } from "../sign/kernel/auth_info/action_logout/mock"
import { standard_MockNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/mock"
import { standard_MockLoadSeasonResource } from "../../example/common/action_load_season/mock"
import { standard_MockLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/mock"
import { standard_MockLoadMenuResource } from "../../outline/menu/action_load_menu/mock"

import { ProfileResource } from "./entryPoint"

export function initMockAuthProfileResource(): ProfileResource {
    return {
        ...standard_MockNotifyUnexpectedErrorResource(),
        ...standard_MockLoadBreadcrumbListResource(),
        ...standard_MockLoadMenuResource(),
        ...standard_MockLoadSeasonResource(),
        ...standard_MockLogoutResource(),
    }
}
