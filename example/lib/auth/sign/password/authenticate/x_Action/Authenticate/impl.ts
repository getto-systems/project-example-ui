import { newSignLinkResource } from "../../../../common/link/Action/impl"

import { AuthenticatePasswordAction, AuthenticatePasswordEntryPoint } from "./action"
import { CoreAction } from "./Core/action"
import { FormAction } from "./Form/action"

export function toEntryPoint(action: AuthenticatePasswordAction): AuthenticatePasswordEntryPoint {
    return {
        // TODO newAuthSignLinkResource ではなく、 href: newSignHrefMaterial にしたい
        // TODO あるいは、引数で渡されるべきなのかも
        resource: { authenticate: action, ...newSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function toAction(
    actions: Readonly<{ core: CoreAction; form: FormAction }>,
): AuthenticatePasswordAction {
    return {
        ...actions,
        terminate: () => {
            actions.core.terminate()
            actions.form.terminate()
        },
    }
}
