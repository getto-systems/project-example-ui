import { RepositoryError } from "../../../../../z_vendor/getto-application/infra/repository/data"

export type ClearEvent =
    | Readonly<{ type: "failed-to-logout"; err: RepositoryError }>
    | Readonly<{ type: "succeed-to-logout" }>