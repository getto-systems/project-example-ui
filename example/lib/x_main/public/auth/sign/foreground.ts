import { render, h } from "preact"

import { newWorker } from "../../../../z_vendor/getto-application/action/worker/init"
import { newSignWorkerForeground } from "../../../../auth/action_sign/init/worker/foreground"

import { Sign } from "../../../../auth/action_sign/x_preact/sign"

render(
    h(
        Sign,
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
