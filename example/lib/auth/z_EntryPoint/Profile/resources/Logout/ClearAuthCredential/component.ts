import { ApplicationComponent } from "../../../../../../vendor/getto-example/Application/component"

import { ClearAuthCredentialAction } from "../../../../../sign/authCredential/clear/action"

import { StorageError } from "../../../../../../common/storage/data"

export interface ClearAuthCredentialComponent
    extends ApplicationComponent<ClearAuthCredentialComponentState> {
    submit(): void
}

export type ClearAuthCredentialMaterial = Readonly<{
    foreground: ClearAuthCredentialForegroundMaterial
}>
export type ClearAuthCredentialForegroundMaterial = Readonly<{
    clear: ClearAuthCredentialAction
}>

export type ClearAuthCredentialComponentState =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "failed-to-logout"; err: StorageError }>
    | Readonly<{ type: "succeed-to-logout" }>

export const initialClearAuthCredentialComponentState: ClearAuthCredentialComponentState = {
    type: "initial-logout",
}
