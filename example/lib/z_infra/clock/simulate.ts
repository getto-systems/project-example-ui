import { Clock } from "../../auth/login/renew/infra"

export function initStaticClock(staticNow: Date): Clock {
    return new StaticClock(staticNow)
}

class StaticClock {
    staticNow: Date

    constructor(staticNow: Date) {
        this.staticNow = staticNow
    }

    now(): Date {
        return this.staticNow
    }
}
