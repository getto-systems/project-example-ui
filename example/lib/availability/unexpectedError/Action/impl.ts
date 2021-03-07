import { NotifyUnexpectedErrorResource } from "./resource"

import { NotifyUnexpectedErrorCoreAction } from "./Core/action"

export function initNotifyUnexpectedErrorResource(
    error: NotifyUnexpectedErrorCoreAction,
): NotifyUnexpectedErrorResource {
    return { error }
}
