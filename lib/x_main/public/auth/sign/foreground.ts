import { render, h } from "preact"

import { newWorker } from "../../../../z_vendor/getto-application/action/worker/init"
import { newSignWorkerForeground } from "../../../../auth/action_sign/init/worker/foreground"

import { SignEntry } from "../../../../auth/action_sign/x_preact/sign"
import { foregroundOutsideFeature } from "../../../helper"

render(
    h(
        SignEntry,
        newSignWorkerForeground({
            ...foregroundOutsideFeature(),
            worker: newWorker({
                currentScript: document.currentScript,
            }),
        }),
    ),
    document.body,
)
