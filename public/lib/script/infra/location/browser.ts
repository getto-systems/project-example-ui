import { PathnameLocation, PathnameResponse } from "../../infra";

export function initBrowserPathnameLocation(browserLocation: Location): PathnameLocation {
    return new BrowserPathnameLocation(browserLocation);
}

class BrowserPathnameLocation implements PathnameLocation {
    browserLocation: Location

    constructor(browserLocation: Location) {
        this.browserLocation = browserLocation;
    }

    pathname(): PathnameResponse {
        try {
            return { success: true, pathname: { pathname: this.browserLocation.pathname } }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err } }
        }
    }
}
