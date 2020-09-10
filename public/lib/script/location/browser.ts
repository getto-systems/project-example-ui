import { PathnameLocation, PathnameFound } from "../infra";

export function initBrowserPathnameLocation(browserLocation: Location): PathnameLocation {
    return new BrowserPathnameLocation(browserLocation);
}

class BrowserPathnameLocation implements PathnameLocation {
    browserLocation: Location

    constructor(browserLocation: Location) {
        this.browserLocation = browserLocation;
    }

    async pathname(): Promise<PathnameFound> {
        return { found: true, pathname: { pathname: this.browserLocation.pathname } };
    }
}
