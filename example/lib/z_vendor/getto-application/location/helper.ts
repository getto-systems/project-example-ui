import { ConvertLocationResult, LocationDetecter } from "./detecter"

export function backgroundLocationDetecter<T>(
    result: ConvertLocationResult<T>,
): LocationDetecter<T> {
    return () => result
}
