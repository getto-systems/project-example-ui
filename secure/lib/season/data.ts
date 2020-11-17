export type Season = { Season: never }

export type LoadEvent =
    | Readonly<{ type: "try-to-load" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
