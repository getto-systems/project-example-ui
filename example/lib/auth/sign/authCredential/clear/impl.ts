import { ClearActionInfra, Logout } from "./infra"

import { ClearAction, ClearActionPod } from "./action"

export function initClearAction(pod: ClearActionPod): ClearAction {
    return {
        logout: pod.initLogout(),
    }
}
export function initClearActionPod(infra: ClearActionInfra): ClearActionPod {
    return {
        initLogout: logout(infra),
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
