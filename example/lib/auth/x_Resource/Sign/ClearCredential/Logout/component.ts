import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { ClearAction } from "../../../../sign/authCredential/clear/action"

import { StorageError } from "../../../../../common/auth/storage/data"

export interface LogoutComponentFactory {
    (material: LogoutMaterial): LogoutComponent
}
export type LogoutMaterial = Readonly<{
    clear: ClearAction
}>

export interface LogoutComponent extends ApplicationComponent<LogoutComponentState> {
    submit(): void
}

export type LogoutComponentState =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>

export const initialLogoutComponentState: LogoutComponentState = { type: "initial-logout" }
