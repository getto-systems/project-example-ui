import { newNotifyUnexpectedErrorRemoteAccess } from "./infra/remote/notifyUnexpectedError/main"

import { initUnexpectedErrorAction } from "./impl"

import { UnexpectedErrorAction } from "./action"

export function newErrorAction(): UnexpectedErrorAction {
    return initUnexpectedErrorAction({
        notify: newNotifyUnexpectedErrorRemoteAccess(),
    })
}
