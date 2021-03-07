import { notifyUnexpectedError } from "../impl"

import { NotifyUnexpectedErrorInfra } from "../infra"

import { NotifyUnexpectedErrorAction } from "./action"

export function initNotifyUnexpectedErrorAction(
    infra: NotifyUnexpectedErrorInfra,
): NotifyUnexpectedErrorAction {
    return {
        notify: notifyUnexpectedError(infra),
    }
}
