import { LocationDetecter, LocationDetectMethod } from "./detecter"

export function newLocationDetecter<T>(
    currentLocation: Location,
    method: LocationDetectMethod<T>,
): LocationDetecter<T> {
    return () => method(new URL(currentLocation.toString()))
}
