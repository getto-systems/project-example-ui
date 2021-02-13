import { NotifyErrorBackgroundAction, NotifyErrorResource } from "./resource"

import { NotifyMaterial } from "./Notify/component"

import { initNotifyComponent } from "./Notify/impl"

export function initNotifyErrorResource(background: NotifyErrorBackgroundAction): NotifyErrorResource {
    return {
        notify: initNotifyComponent(notifyMaterial()),
    }

    function notifyMaterial(): NotifyMaterial {
        return {
            notify: background.notify.notify(),
        }
    }
}
