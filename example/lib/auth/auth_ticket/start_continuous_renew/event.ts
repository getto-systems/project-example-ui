import { RepositoryError } from "../../../z_vendor/getto-application/infra/repository/data"
import { RenewAuthTicketError } from "../kernel/data"

export type StartContinuousRenewEvent =
    | Readonly<{ type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "authn-not-expired" }>
    | Readonly<{ type: "succeed-to-continuous-renew" }>
    | Readonly<{ type: "failed-to-continuous-renew"; err: RenewAuthTicketError }>
    | Readonly<{ type: "repository-error"; err: RepositoryError }>
