import { newFindNextVersionEntryPoint } from "../../../../avail/version/view_find_next/init"

import { MoveToNextVersion } from "../../../../avail/version/view_find_next/x_plain/move_to_next_version"

MoveToNextVersion(
    newFindNextVersionEntryPoint({
        currentLocation: location,
    }),
)
