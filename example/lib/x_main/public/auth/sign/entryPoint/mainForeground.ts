import { render, h } from "preact"

import { newWorker } from "../../../../../z_vendor/getto-application/action/init/worker"
import { newSignWorkerForeground } from "../../../../../auth/sign/view/Action/init/worker/foreground"

import { SignView } from "../../../../../auth/sign/view/Action/x_preact/SignView"

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
