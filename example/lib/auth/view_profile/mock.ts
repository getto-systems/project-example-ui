import { mockLogoutResource } from "../sign/kernel/auth_info/action_logout/mock"

import { ProfileResource } from "./entryPoint"
import { standard_MockBaseResource } from "../../example/view_base/mock"

export function mockAuthProfileResource(): ProfileResource {
    return {
        ...standard_MockBaseResource(),
        ...mockLogoutResource(),
    }
}
