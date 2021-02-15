import { ErrorForegroundAction, ErrorResource } from "./resource"

import { initNotifyComponent } from "./Notify/impl"

export function initErrorResource(foreground: ErrorForegroundAction): ErrorResource {
    return {
        notify: initNotifyComponent(foreground),
    }
}
