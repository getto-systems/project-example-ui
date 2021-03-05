import { newSignSearchResource } from "../../../../../common/search/Action/impl"

import { ResetPasswordAction, ResetPasswordEntryPoint } from "./action"
import { CoreAction } from "./Core/action"
import { FormAction } from "./Form/action"

export function toEntryPoint(action: ResetPasswordAction): ResetPasswordEntryPoint {
    return {
        resource: { reset: action, ...newSignSearchResource() },
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
