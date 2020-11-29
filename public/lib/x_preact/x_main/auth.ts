import { render, h } from "preact"

import { newAuthViewFactoryAsWorkerForeground } from "../../auth/Auth/main/core"

import { Main } from "../auth/view"

render(
    h(Main, {
        factory: newAuthViewFactoryAsWorkerForeground({
            credentialStorage: localStorage,
            currentLocation: location,
        }),
    }),
    document.body
)
