import { mockLogoutResource } from "../sign/auth_ticket/action_logout/mock"

import { ProfileResource } from "./resource"
import { mockBaseResource } from "../../example/action_base/mock"

export function mockAuthProfileResource(): ProfileResource {
    return {
        ...mockBaseResource(),
        ...mockLogoutResource(),
    }
}
