import { ClearActionInfra, Logout } from "./infra"

import { ClearAction,  } from "./action"

export function initClearAction(infra: ClearActionInfra): ClearAction {
    return {
        logout: logout(infra)(),
    }
}

const logout: Logout = (infra) => () => async (post) => {
    const { authCredentials } = infra
    const result = authCredentials.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}
