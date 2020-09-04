import { Pathname } from "../data";
import { PathnameLocation, PathnameFound } from "../infra";

export function initSimulateLocation(pathname: Pathname): PathnameLocation {
    return {
        async pathname(): Promise<PathnameFound> {
            return { found: true, pathname };
        },
    };
}
