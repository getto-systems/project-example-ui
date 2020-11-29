import { render, h } from "preact"

import { newAuthViewFactoryAsWorkerForeground } from "../../auth/Auth/View/main"

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
