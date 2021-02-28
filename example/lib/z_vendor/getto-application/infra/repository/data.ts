export type RepositoryError =
    | Readonly<{ type: "transform-error"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
