import { newStartPasswordResetSessionAction } from "../../../../../../sign/x_Action/Password/ResetSession/Start/Core/main/core"
import { newStartPasswordResetSessionFormAction } from "../../../../../../sign/x_Action/Password/ResetSession/Start/Form/main"

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
