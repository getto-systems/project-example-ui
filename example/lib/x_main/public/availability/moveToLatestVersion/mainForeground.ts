import { h, render } from "preact"

import { newForeground } from "../../../../availability/z_EntryPoint/MoveToNextVersion/main/single"

import { EntryPoint } from "../../../../x_preact/availability/MoveToLatestVersion/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            currentURL: new URL(location.toString()),
        }),
    ),
    document.body,
)
