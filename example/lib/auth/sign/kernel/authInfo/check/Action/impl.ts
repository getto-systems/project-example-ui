import { CheckAuthInfoEntryPoint } from "./entryPoint"
import { CheckAuthInfoCoreAction } from "./Core/action"

export function toCheckAuthInfoEntryPoint(action: CheckAuthInfoCoreAction): CheckAuthInfoEntryPoint {
    return {
        resource: { core: action },
        terminate: () => action.terminate(),
    }
}
