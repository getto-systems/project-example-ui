import { PathnameLocation, PathnameFound } from "../../infra";

import { Pathname } from "../../data";

export function initSimulatePathnameLocation(returnPathname: Pathname): PathnameLocation {
    return new SimulatePathnameLocation(returnPathname);
}

class SimulatePathnameLocation implements PathnameLocation {
    returnPathname: Pathname

    constructor(returnPathname: Pathname) {
        this.returnPathname = returnPathname;
    }

    async pathname(): Promise<PathnameFound> {
        return { found: true, pathname: this.returnPathname };
    }
}
