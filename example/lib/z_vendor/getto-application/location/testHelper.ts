import { LocationDetecter, LocationDetectMethod } from "./detecter"

export function initLocationDetecter<T>(
    currentURL: URL,
    method: LocationDetectMethod<T>,
): LocationDetecter<T> {
    return () => method(currentURL)
}
