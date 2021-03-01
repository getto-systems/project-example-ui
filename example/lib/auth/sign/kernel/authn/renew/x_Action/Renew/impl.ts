import { RenewAuthnInfoEntryPoint } from "./action"
import { CoreAction } from "./Core/action"

export function toEntryPoint(action: CoreAction): RenewAuthnInfoEntryPoint {
    return {
        resource: { core: action },
        terminate: () => action.terminate(),
    }
}
