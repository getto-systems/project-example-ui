import { initSignLinkResource } from "../../../common/link/action/impl"
import { RequestResetTokenAction, RequestResetTokenEntryPoint } from "./entry_point"
import { RequestResetTokenCoreAction } from "./core/action"
import { RequestResetTokenFormAction } from "./form/action"

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
