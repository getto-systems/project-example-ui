import { ConvertLocationResult } from "../../z_vendor/getto-application/location/infra"

import { ContentPath } from "./data"

export type LoadContentEvent = Readonly<{
    type: "succeed-to-load"
    path: ConvertLocationResult<ContentPath>
}>
