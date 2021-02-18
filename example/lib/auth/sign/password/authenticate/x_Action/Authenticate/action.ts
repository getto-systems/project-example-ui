import { AuthSignLinkResource } from "../../../../common/searchParams/x_Action/Link/action"
import { AuthenticatePasswordCoreAction } from "./Core/action"
import { AuthenticatePasswordFormAction } from "./Form/action"

export type AuthenticatePasswordEntryPoint = Readonly<{
    resource: AuthenticatePasswordResource & AuthSignLinkResource
    terminate: { (): void }
}>
export type AuthenticatePasswordResource = Readonly<{
    core: AuthenticatePasswordCoreAction
    form: AuthenticatePasswordFormAction
}>
