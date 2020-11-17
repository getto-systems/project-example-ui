import { Season } from "./data"

export function packSeason(season: Season_data): Season {
    return season as Season & Season_data
}

export function unpackSeason(season: Season): Season_data {
    return (season as unknown) as Season_data
}

type Season_data = Readonly<{
    year: number
}>
