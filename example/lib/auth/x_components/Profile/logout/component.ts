import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

import { Logout } from "../../../login/credentialStore/action"

import { StorageError } from "../../../common/credential/data"

export interface LogoutComponentFactory {
    (material: LogoutMaterial): LogoutComponent
}
export type LogoutMaterial = Readonly<{
    logout: Logout
}>

export interface LogoutComponent extends ApplicationComponent<LogoutComponentState> {
    submit(): void
}

export type LogoutComponentState =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>

export const initialLogoutComponentState: LogoutComponentState = { type: "initial-logout" }
