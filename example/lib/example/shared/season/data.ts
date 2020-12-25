export type Season = Season_data & { Season: never }
type Season_data = Readonly<{
    year: number
}>
export function markSeason(season: Season_data): Season {
    return season as Season
}
export function defaultSeason(now: Date): Season {
    return markSeason({ year: now.getFullYear() })
}

export type LoadSeasonEvent =
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export type SeasonError = Readonly<{ type: "infra-error"; err: string }>
