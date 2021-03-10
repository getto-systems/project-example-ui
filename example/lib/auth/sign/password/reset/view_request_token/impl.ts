import { initSignLinkResource } from "../../../common/link/action/impl"
import { RequestResetTokenAction, RequestResetTokenEntryPoint } from "./entry_point"
import { RequestResetTokenCoreAction } from "./core/action"
import { RequestResetTokenFormAction } from "./form/action"

export function initRequestResetTokenEntryPoint(
    actions: Readonly<{
        core: RequestResetTokenCoreAction
        form: RequestResetTokenFormAction
    }>,
): RequestResetTokenEntryPoint {
    const action = initAction(actions)
    return {
        resource: { requestToken: action, ...initSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

function initAction(
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
