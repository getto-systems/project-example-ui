import { render, h } from "preact"

import { newWorker } from "../../../../z_vendor/getto-application/action/init/worker"
import { newSignWorkerForeground } from "../../../../auth/view_sign/init/worker/foreground"

import { SignView } from "../../../../auth/view_sign/x_preact/SignView"

render(
    h(
        SignView,
        newSignWorkerForeground({
            webStorage: localStorage,
            currentLocation: location,
            worker: newWorker({
                currentScript: document.currentScript,
            }),
        }),
    ),
    document.body,
)
