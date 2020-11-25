import { YearRepository } from "../../../infra"

export function initDateYearRepository(today: Date): YearRepository {
    return new DateYearRepository(today)
}

class DateYearRepository implements YearRepository {
    today: Date

    constructor(today: Date) {
        this.today = today
    }

    currentYear(): number {
        return this.today.getFullYear()
    }
}
