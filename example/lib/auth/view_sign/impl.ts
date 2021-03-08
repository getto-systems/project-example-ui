import { SignEntryPoint } from "./entry_point"

import { SignAction } from "./core/action"

export function toSignEntryPoint(action: SignAction): SignEntryPoint {
    return {
        resource: { view: action },
        terminate: () => action.terminate(),
    }
}
