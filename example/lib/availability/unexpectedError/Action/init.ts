import { newAuthzRepository } from "../../../common/authz/infra/repository/authz"
import { newNotifyUnexpectedErrorRemote } from "../infra/remote/notifyUnexpectedError/init"

import { initNotifyUnexpectedErrorAction } from "./impl"

import { NotifyUnexpectedErrorAction } from "./action"

export function newNotifyUnexpectedErrorAction(webStorage: Storage): NotifyUnexpectedErrorAction {
    return initNotifyUnexpectedErrorAction({
        authz: newAuthzRepository(webStorage),
        notify: newNotifyUnexpectedErrorRemote(),
    })
}
