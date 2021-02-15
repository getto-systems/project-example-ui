import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { ClearAuthCredentialAction } from "../../../../sign/authCredential/clear/action"

import { StorageError } from "../../../../../common/storage/data"

export interface LogoutComponentFactory {
    (material: LogoutMaterial): LogoutComponent
}
export type LogoutMaterial = Readonly<{
    clear: ClearAuthCredentialAction
}>

export interface LogoutComponent extends ApplicationComponent<LogoutComponentState> {
    submit(): void
}

export type LogoutComponentState =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>

export const initialLogoutComponentState: LogoutComponentState = { type: "initial-logout" }
