import { Season, SeasonError } from "./data";

export type LoadSeasonEvent =
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>
