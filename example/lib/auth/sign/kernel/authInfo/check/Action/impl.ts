import { CheckAuthInfoEntryPoint } from "./action"
import { CoreAction } from "./Core/action"

export function toEntryPoint(action: CoreAction): CheckAuthInfoEntryPoint {
    return {
        resource: { core: action },
        terminate: () => action.terminate(),
    }
}
