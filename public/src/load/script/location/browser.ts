import { Pathname } from "../data";
import { PathnameLocation } from "../infra";

export function initBrowserLocation(location: Location): PathnameLocation {
    return {
        async pathname(): Promise<Pathname> {
            return location.pathname;
        },
    };
}
