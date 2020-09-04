import { PathnameLocation, PathnameFound } from "../infra";

export function initBrowserLocation(location: Location): PathnameLocation {
    return {
        async pathname(): Promise<PathnameFound> {
            return { found: true, pathname: { pathname: location.pathname } };
        },
    };
}
