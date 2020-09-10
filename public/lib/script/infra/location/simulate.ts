import { PathnameLocation, PathnameResponse } from "../../infra"

import { Pathname } from "../../data"

export function initSimulatePathnameLocation(returnPathname: Pathname): PathnameLocation {
    return new SimulatePathnameLocation(returnPathname)
}

class SimulatePathnameLocation implements PathnameLocation {
    returnPathname: Pathname

    constructor(returnPathname: Pathname) {
        this.returnPathname = returnPathname
    }

    pathname(): PathnameResponse {
        return { success: true, pathname: this.returnPathname }
    }
}
