import { LocationDetecter, LocationDetectMethod } from "./infra"

export function initLocationDetecter<T>(
    currentURL: URL,
    method: LocationDetectMethod<T>,
): LocationDetecter<T> {
    return () => method(currentURL)
}
