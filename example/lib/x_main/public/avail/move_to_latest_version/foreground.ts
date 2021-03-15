import { h, render } from "preact"

import { newFindNextVersionEntryPoint } from "../../../../avail/version/action_find_next/init"

import { MoveToLatestVersion } from "../../../../avail/version/action_find_next/x_preact/move_to_latest_version"

render(
    h(
        MoveToLatestVersion,
        newFindNextVersionEntryPoint({
            currentLocation: location,
        }),
    ),
    document.body,
)
