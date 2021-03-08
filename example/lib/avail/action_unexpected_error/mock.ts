import { initMockNotifyUnexpectedErrorCoreAction } from "./core/mock"

import { NotifyUnexpectedErrorResource } from "./resource"

export function standard_MockNotifyUnexpectedErrorResource(): NotifyUnexpectedErrorResource {
    return {
        error: initMockNotifyUnexpectedErrorCoreAction(),
    }
}
