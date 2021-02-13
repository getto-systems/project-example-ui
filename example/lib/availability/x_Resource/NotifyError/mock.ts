import { initMockNotifyComponent } from "./Notify/mock"

import { NotifyErrorResource } from "./resource"

export function initMockNotifyErrorResource(): NotifyErrorResource {
    return {
        notify: initMockNotifyComponent(),
    }
}
