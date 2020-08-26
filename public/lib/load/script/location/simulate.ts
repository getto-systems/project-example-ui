import { Pathname } from "../data";
import { PathnameLocation } from "../infra";

export function initSimulateLocation(pathname: Pathname): PathnameLocation {
    return {
        async pathname(): Promise<Pathname> {
            return pathname;
        },
    };
}
