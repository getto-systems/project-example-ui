import { newForeground } from "../../../../availability/z_EntryPoint/MoveToNextVersion/main/single"

import { EntryPoint } from "../../../../x_plain/availability/MoveToNextVersion/EntryPoint"

EntryPoint(
    newForeground({
        currentURL: new URL(location.toString()),
    }),
)