import { initMockNotifyUnexpectedErrorCoreAction } from "./Core/mock"

import { NotifyUnexpectedErrorResource } from "./resource"

export function standard_MockNotifyUnexpectedErrorResource(): NotifyUnexpectedErrorResource {
    return {
        error: initMockNotifyUnexpectedErrorCoreAction(),
    }
}
