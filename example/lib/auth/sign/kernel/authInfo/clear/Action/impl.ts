import { LogoutResource } from "./action"
import { LogoutCoreAction } from "./Core/action"

export function toLogoutResource(action: LogoutCoreAction): LogoutResource {
    return { logout: action }
}
