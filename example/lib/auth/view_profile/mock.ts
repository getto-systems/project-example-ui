import { mockLogoutResource } from "../sign/auth_ticket/action_logout/mock"

import { ProfileResource } from "./entry_point"
import { mockBaseResource } from "../../example/view_base/mock"

export function mockAuthProfileResource(): ProfileResource {
    return {
        ...mockBaseResource(),
        ...mockLogoutResource(),
    }
}
