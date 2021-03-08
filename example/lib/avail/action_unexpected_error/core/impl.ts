import { notifyUnexpectedError } from "../../unexpected_error/impl"

import { NotifyUnexpectedErrorInfra } from "../../unexpected_error/infra"

import { NotifyUnexpectedErrorCoreAction } from "./action"

export function initNotifyUnexpectedErrorCoreAction(
    infra: NotifyUnexpectedErrorInfra,
): NotifyUnexpectedErrorCoreAction {
    return {
        notify: notifyUnexpectedError(infra),
    }
}
