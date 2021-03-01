import { LogoutResource } from "./action"
import { CoreAction } from "./Core/action"

export function toLogoutResource(action: CoreAction): LogoutResource {
    return { logout: action }
}
