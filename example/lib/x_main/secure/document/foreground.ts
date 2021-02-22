import { render, h } from "preact"

import { newForeground } from "../../../document/x_components/Document/EntryPoint/main/single"

import { EntryPoint } from "../../../x_preact/document/Document/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            webStorage: localStorage,
            currentURL: new URL(location.toString()),
        }),
    ),
    document.body,
)
