import { h, render } from "preact"

import { newFindNextVersionEntryPoint } from "../../../../avail/version/findNext/Action/init"

import { MoveToLatestVersion } from "../../../../avail/version/findNext/Action/x_preact/MoveToLatestVersion"

render(
    h(
        MoveToLatestVersion,
        newFindNextVersionEntryPoint({
            currentLocation: location,
        }),
    ),
    document.body,
)
