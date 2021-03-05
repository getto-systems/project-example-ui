import { newSignLinkResource } from "../../../../../common/link/Action/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./action"
import { CoreAction } from "./Core/action"
import { FormAction } from "./Form/action"

export function toEntryPoint(action: ResetPasswordAction): ResetPasswordEntryPoint {
    return {
        resource: { reset: action, ...newSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAction(
    actions: Readonly<{
        core: CoreAction
        form: FormAction
    }>,
): ResetPasswordAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
