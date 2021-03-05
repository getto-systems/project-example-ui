import { RepositoryError } from "../../../../../../z_vendor/getto-application/infra/repository/data"
import { RenewAuthInfoError } from "../../kernel/data"

export type StartContinuousRenewEvent =
    | Readonly<{ type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "lastAuth-not-expired" }>
    | Readonly<{ type: "succeed-to-continuous-renew" }>
    | Readonly<{ type: "failed-to-continuous-renew"; err: RenewAuthInfoError }>
    | Readonly<{ type: "repository-error"; err: RepositoryError }>
