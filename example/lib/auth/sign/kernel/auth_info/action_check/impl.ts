import { CheckAuthInfoEntryPoint } from "./entry_point"
import { CheckAuthInfoCoreAction } from "./core/action"

export function initCheckAuthInfoEntryPoint(action: CheckAuthInfoCoreAction): CheckAuthInfoEntryPoint {
    return {
        resource: { core: action },
        terminate: () => action.terminate(),
    }
}
