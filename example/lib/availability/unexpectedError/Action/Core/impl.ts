import { notifyUnexpectedError } from "../../impl"

import { NotifyUnexpectedErrorInfra } from "../../infra"

import { NotifyUnexpectedErrorCoreAction } from "./action"

export function initNotifyUnexpectedErrorCoreAction(
    infra: NotifyUnexpectedErrorInfra,
): NotifyUnexpectedErrorCoreAction {
    return {
        notify: notifyUnexpectedError(infra),
    }
}
