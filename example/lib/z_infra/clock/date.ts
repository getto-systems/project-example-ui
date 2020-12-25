import { Clock } from "../../auth/login/renew/infra"

export function initDateClock(): Clock {
    return new DateClock()
}

class DateClock {
    now(): Date {
        return new Date()
    }
}
