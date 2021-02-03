import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { menuBox } from "../../z_vendor/getto-css/preact/layout/app"
import { field } from "../../z_vendor/getto-css/preact/design/form"
import { VNodeContent } from "../../z_vendor/getto-css/preact/common"
import { notice_alert } from "../../z_vendor/getto-css/preact/design/highlight"

import { useComponent } from "../common/hooks"

import { SeasonInfoComponent, initialSeasonInfoState } from "../../example/Outline/seasonInfo/component"

import { Season, SeasonError } from "../../example/shared/season/data"

type Props = Readonly<{
    seasonInfo: SeasonInfoComponent
}>
export function SeasonInfo({ seasonInfo }: Props): VNode {
    const state = useComponent(seasonInfo, initialSeasonInfoState)
    useEffect(() => {
        seasonInfo.load()
    }, [])

    switch (state.type) {
        case "initial-season":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return seasonBox(seasonContent(state.season))

        case "failed-to-load":
            return seasonBox(errorContent(state.err))
    }
}

function seasonBox(body: VNodeContent) {
    return menuBox(field({ title: "シーズン", body }))
}

function seasonContent(season: Season) {
    return season.year
}
function errorContent(err: SeasonError) {
    return [notice_alert("ロードエラー"), html`<small><p>詳細: ${err.err}</p></small>`]
}

const EMPTY_CONTENT = html``
