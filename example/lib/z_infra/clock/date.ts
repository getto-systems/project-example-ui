import { Clock } from "./infra"

export function initDateClock(): Clock {
    return new DateClock()
}

class DateClock {
    now(): Date {
        return new Date()
    }
}
