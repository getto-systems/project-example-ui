import { SignEntryPoint } from "./entry_point"

import { SignAction } from "./core/action"

export function initSignEntryPoint(action: SignAction): SignEntryPoint {
    return {
        resource: { view: action },
        terminate: () => action.terminate(),
    }
}
