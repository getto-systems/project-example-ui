import { CheckAuthTicketEntryPoint } from "./entry_point"
import { CheckAuthTicketCoreAction } from "./core/action"

export function initCheckAuthTicketEntryPoint(
    action: CheckAuthTicketCoreAction,
): CheckAuthTicketEntryPoint {
    return {
        resource: { core: action },
        terminate: () => action.terminate(),
    }
}
