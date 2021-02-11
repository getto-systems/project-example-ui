import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import { label_alert, notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"

import { useComponent } from "../hooks"

import {
    SeasonInfoComponent,
    initialSeasonInfoComponentState,
} from "../../../example/x_components/Outline/seasonInfo/component"

import { Season, SeasonError } from "../../../example/shared/season/data"

type Props = Readonly<{
    seasonInfo: SeasonInfoComponent
}>
export function SeasonInfo({ seasonInfo }: Props): VNode {
    const state = useComponent(seasonInfo, initialSeasonInfoComponentState)
    useEffect(() => {
        seasonInfo.load()
    }, [])

    switch (state.type) {
        case "initial-season":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return info(seasonContent(state.season))

        case "failed-to-load":
            return info(errorContent(state.err))
    }
}

function info(body: VNodeContent) {
    return html`<small>シーズン:</small> ${body}`
}

function seasonContent(season: Season) {
    return season.year
}
function errorContent(err: SeasonError) {
    return [label_alert("ロードエラー"), ...detail()]

    function detail(): VNode[] {
        if (err.err.length === 0) {
            return []
        }
        return [html` <small>詳細: ${err.err}</small>`]
    }
}

const EMPTY_CONTENT = html``
