import { newStartPasswordResetSessionAction } from "../Core/main/core"
import { newStartPasswordResetSessionFormAction } from "../Form/main"

import {
    StartPasswordResetSessionBackgroundResource,
    StartPasswordResetSessionResource,
} from "../resource"

export function newStartPasswordResetSessionResource(): StartPasswordResetSessionResource {
    return newStartPasswordResetSessionResource_merge({
        start: newStartPasswordResetSessionAction(),
    })
}
export function newStartPasswordResetSessionResource_merge(
    background: StartPasswordResetSessionBackgroundResource
): StartPasswordResetSessionResource {
    return {
        ...background,
        form: newStartPasswordResetSessionFormAction(),
    }
}
