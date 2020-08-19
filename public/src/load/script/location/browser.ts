import { Pathname } from "../data";
import { PathnameLocation } from "../infra";

export function initBrowserLocation(location: Location): PathnameLocation {
    return {
        pathname(): Pathname {
            return location.pathname;
        },
    };
}
