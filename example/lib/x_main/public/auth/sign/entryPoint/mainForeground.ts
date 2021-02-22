import { render, h } from "preact"
import { newWorker } from "../../../../../z_getto/application/worker/foreground"

import { newWorkerForeground } from "../main/worker/foreground"

import { EntryPoint } from "../x_preact/EntryPoint"

render(
    h(
        EntryPoint,
        newWorkerForeground({
            webStorage: localStorage,
            currentURL: new URL(location.toString()),
            worker: newWorker({
                renderedDocument: document,
            }),
        }),
    ),
    document.body,
)
