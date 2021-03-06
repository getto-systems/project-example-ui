import { initSignLinkResource } from "../../../common/nav/action_nav/impl"
import { RequestResetTokenAction, RequestResetTokenView } from "./resource"
import { RequestResetTokenCoreAction } from "./core/action"
import { RequestResetTokenFormAction } from "./form/action"

export function initRequestResetTokenView(
    actions: Readonly<{
        core: RequestResetTokenCoreAction
        form: RequestResetTokenFormAction
    }>,
): RequestResetTokenView {
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
