import { LocationDetecter, LocationDetectMethod } from "./infra"

export function newLocationDetecter<T>(
    currentLocation: Location,
    method: LocationDetectMethod<T>,
): LocationDetecter<T> {
    return () => method(new URL(currentLocation.toString()))
}
