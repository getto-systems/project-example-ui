import { render, h } from "preact"

import { newForeground } from "../../../docs/x_components/Docs/EntryPoint/main/single"

import { EntryPoint } from "../../../x_preact/docs/Docs/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            webStorage: localStorage,
            currentURL: new URL(location.toString()),
            currentLocation: location,
        }),
    ),
    document.body,
)
