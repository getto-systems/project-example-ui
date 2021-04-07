import { render, h } from "preact"

import { newWorker } from "../../../../z_vendor/getto-application/action/worker/init"
import { newSignWorkerForeground } from "../../../../auth/action_sign/init/worker/foreground"

import { SignEntry } from "../../../../auth/action_sign/x_preact/sign"

render(
    h(
        SignEntry,
        newSignWorkerForeground({
            webStorage: localStorage,
            webDB: indexedDB,
            webCrypto: crypto,
            currentLocation: location,
            worker: newWorker({
                currentScript: document.currentScript,
            }),
        }),
    ),
    document.body,
)
