import { initMockNotifyComponent } from "./Notify/mock"

import { ErrorResource } from "./resource"

export function initMockErrorResource(): ErrorResource {
    return {
        notify: initMockNotifyComponent(),
    }
}
