import { SignEntryPoint } from "./entryPoint"

import { SignAction } from "./Core/action"

export function toSignEntryPoint(action: SignAction): SignEntryPoint {
    return {
        resource: { view: action },
        terminate: () => action.terminate(),
    }
}
