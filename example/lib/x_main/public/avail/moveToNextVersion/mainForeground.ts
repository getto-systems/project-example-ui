import { newFindNextVersionEntryPoint } from "../../../../avail/version/findNext/Action/init"

import { MoveToNextVersion } from "../../../../avail/version/findNext/Action/x_plain/MoveToNextVersion"

MoveToNextVersion(
    newFindNextVersionEntryPoint({
        currentLocation: location,
    }),
)
