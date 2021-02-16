import { Clock } from "./infra"

export function newDateClock(): Clock {
    return new DateClock()
}

class DateClock {
    now(): Date {
        return new Date()
    }
}
