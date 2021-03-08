import { RepositoryError } from "../../../../../../z_vendor/getto-application/infra/repository/data"

export type SaveAuthInfoResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: RepositoryError }>
