import { Pathname, pathname } from "../data";
import { PathnameLocation } from "../infra";

export function initBrowserLocation(location: Location): PathnameLocation {
    return {
        async pathname(): Promise<Pathname> {
            return pathname(location.pathname);
        },
    };
}
