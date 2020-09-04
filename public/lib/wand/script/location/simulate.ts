import { PathnameLocation, PathnameFound } from "../infra";

import { Pathname } from "../data";

export function initSimulateLocation(pathname: Pathname): PathnameLocation {
    return {
        async pathname(): Promise<PathnameFound> {
            return { found: true, pathname };
        },
    };
}
