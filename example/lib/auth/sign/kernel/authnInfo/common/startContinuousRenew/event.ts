import { RepositoryError } from "../../../../../../z_vendor/getto-application/infra/repository/data"

export type StartContinuousRenewEvent =
    | ForceStartContinuousRenewEvent
    | Readonly<{ type: "repository-error"; err: RepositoryError }>

export type ForceStartContinuousRenewEvent = Readonly<{
    type: "succeed-to-start-continuous-renew"
}>
