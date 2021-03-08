import { ConvertLocationResult, LocationDetecter } from "./infra"

export function backgroundLocationDetecter<T>(
    result: ConvertLocationResult<T>,
): LocationDetecter<T> {
    return () => result
}
