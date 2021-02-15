import { newNotifyRemoteAccess } from "./infra/remote/notify/main"

import { initErrorAction } from "./impl"

import { ErrorAction } from "./action"

export function newErrorAction(): ErrorAction {
    return initErrorAction({
        notify: newNotifyRemoteAccess(),
    })
}
