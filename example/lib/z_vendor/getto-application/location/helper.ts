import { LocationDetecter } from "./infra"

import { ConvertLocationResult } from "./data"

export function backgroundLocationDetecter<T>(
    result: ConvertLocationResult<T>,
): LocationDetecter<T> {
    return () => result
}
