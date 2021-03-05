import { initSignLinkResource } from "../../../../common/link/Action/impl"
import { RequestResetTokenAction, RequestResetTokenEntryPoint } from "./action"
import { RequestResetTokenCoreAction } from "./Core/action"
import { RequestResetTokenFormAction } from "./Form/action"

export function toRequestResetTokenEntryPoint(
    actions: Readonly<{
        core: RequestResetTokenCoreAction
        form: RequestResetTokenFormAction
    }>,
): RequestResetTokenEntryPoint {
    const action = toAction(actions)
    return {
        resource: { requestToken: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function toAction(
    actions: Readonly<{
        core: RequestResetTokenCoreAction
        form: RequestResetTokenFormAction
    }>,
): RequestResetTokenAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
