import { render, h } from "preact"

import { newForeground } from "../../../example/x_components/Dashboard/EntryPoint/main/single"

import { EntryPoint } from "../../../x_preact/example/Dashboard/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
