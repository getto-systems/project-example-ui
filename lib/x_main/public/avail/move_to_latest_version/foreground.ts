import { h, render } from "preact"

import { newFindNextVersionView } from "../../../../avail/version/action_find_next/init"

import { MoveToLatestVersionEntry } from "../../../../avail/version/action_find_next/x_preact/move_to_latest_version"

render(
    h(
        MoveToLatestVersionEntry,
        newFindNextVersionView({
            currentLocation: location,
        }),
    ),
    document.body,
)
