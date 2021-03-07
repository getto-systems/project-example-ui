import { h, render } from "preact"

import { newForeground } from "../../../../avail/z_EntryPoint/MoveToNextVersion/main/single"

import { EntryPoint } from "../../../../x_preact/availability/MoveToLatestVersion/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            currentLocation: location,
        }),
    ),
    document.body,
)
