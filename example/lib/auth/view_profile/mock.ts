import { mockLogoutResource } from "../sign/kernel/auth_info/action_logout/mock"

import { ProfileResource } from "./entry_point"
import { mockBaseResource } from "../../example/view_base/mock"

export function mockAuthProfileResource(): ProfileResource {
    return {
        ...mockBaseResource(),
        ...mockLogoutResource(),
    }
}
