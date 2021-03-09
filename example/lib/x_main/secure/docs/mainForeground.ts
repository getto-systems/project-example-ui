import { render, h } from "preact"

import { newDocsContentEntryPoint } from "../../../docs/view_content/init"

import { DocsContent } from "../../../docs/view_content/x_preact/EntryPoint"

render(
    h(
        DocsContent,
        newDocsContentEntryPoint({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
