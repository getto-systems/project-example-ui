import { RepositoryError } from "../../../z_vendor/getto-application/infra/repository/data"

export type SaveAuthTicketResult =
    | Readonly<{ success: true }>
    | Readonly<{ success: false; err: RepositoryError }>
