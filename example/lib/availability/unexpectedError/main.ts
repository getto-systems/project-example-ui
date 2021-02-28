import { newNotifyUnexpectedErrorRemote } from "./infra/remote/notifyUnexpectedError/init"

import { initUnexpectedErrorAction } from "./impl"

import { UnexpectedErrorAction } from "./action"

export function newErrorAction(): UnexpectedErrorAction {
    return initUnexpectedErrorAction({
        notify: newNotifyUnexpectedErrorRemote(),
    })
}
