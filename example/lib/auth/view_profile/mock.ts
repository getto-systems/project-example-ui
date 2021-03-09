import { standard_MockLogoutResource } from "../sign/kernel/auth_info/action_logout/mock"

import { ProfileResource } from "./entryPoint"
import { standard_MockBaseResource } from "../../example/view_base/mock"

export function standard_MockAuthProfileResource(): ProfileResource {
    return {
        ...standard_MockBaseResource(),
        ...standard_MockLogoutResource(),
    }
}
