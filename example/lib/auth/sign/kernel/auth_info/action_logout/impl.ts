import { LogoutResource } from "./resource"
import { LogoutCoreAction } from "./core/action"

export function toLogoutResource(action: LogoutCoreAction): LogoutResource {
    return { logout: action }
}
