import { RepositoryError } from "../../../../../z_vendor/getto-application/infra/repository/data"
import { Authn, RenewError } from "../kernel/data"

export type RenewEvent = Readonly<{ type: "try-to-instant-load" }> | ForceRenewEvent

export type ForceRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "repository-error"; err: RepositoryError }>
    | Readonly<{ type: "succeed-to-renew"; authnInfo: Authn }>
