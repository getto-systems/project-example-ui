import { Clock } from "./infra"

export function initStaticClock(staticNow: Date): StaticClock {
    return new StaticClock(staticNow)
}

export class StaticClock implements Clock {
    staticNow: Date

    constructor(staticNow: Date) {
        this.staticNow = staticNow
    }

    now(): Date {
        return this.staticNow
    }
    update(updatedNow: Date): void {
        this.staticNow = updatedNow
    }
}
