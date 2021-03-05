import { initSignLinkResource } from "../../../../../common/link/Action/impl"
import { RequestPasswordResetTokenAction, RequestPasswordResetTokenEntryPoint } from "./action"
import { CoreAction } from "./Core/action"
import { FormAction } from "./Form/action"

export function toEntryPoint(
    action: RequestPasswordResetTokenAction,
): RequestPasswordResetTokenEntryPoint {
    return {
        resource: { requestToken: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAction(
    actions: Readonly<{
        core: CoreAction
        form: FormAction
    }>,
): RequestPasswordResetTokenAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
