import { newFindNextVersionView } from "../../../../avail/version/action_find_next/init"

import { MoveToNextVersionEntry } from "../../../../avail/version/action_find_next/x_plain/move_to_next_version"

MoveToNextVersionEntry(
    newFindNextVersionView({
        currentLocation: location,
    }),
)
