import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

import { LoadSeason } from "../../../../example/shared/season/action"

import { Season, SeasonError } from "../../../../example/shared/season/data"

export interface LogoutComponentFactory {
    (material: LogoutMaterial): LogoutComponent
}
export type LogoutMaterial = Readonly<{
    loadSeason: LoadSeason
}>

export interface LogoutComponent extends ApplicationComponent<LogoutComponentState> {
    load(): void
}

export type LogoutComponentState =
    | Readonly<{ type: "initial-logout" }>
    | Readonly<{ type: "succeed-to-load"; season: Season }>
    | Readonly<{ type: "failed-to-load"; err: SeasonError }>

export const initialLogoutComponentState: LogoutComponentState = { type: "initial-logout" }
