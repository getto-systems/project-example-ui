import { LogoutResource } from "./resource"
import { LogoutCoreAction } from "./Core/action"

export function toLogoutResource(action: LogoutCoreAction): LogoutResource {
    return { logout: action }
}
