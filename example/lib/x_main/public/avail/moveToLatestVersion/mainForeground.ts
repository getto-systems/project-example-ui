import { h, render } from "preact"

import { newFindNextVersionEntryPoint } from "../../../../avail/version/view_find_next/init"

import { MoveToLatestVersion } from "../../../../avail/version/view_find_next/x_preact/MoveToLatestVersion"

render(
    h(
        MoveToLatestVersion,
        newFindNextVersionEntryPoint({
            currentLocation: location,
        }),
    ),
    document.body,
)
