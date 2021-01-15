import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { v_small } from "../layout"

import { SeasonInfoComponent, initialSeasonInfoState } from "../../../example/Outline/seasonInfo/component"

import { Season, SeasonError } from "../../../example/shared/season/data"

type Props = Readonly<{
    seasonInfo: SeasonInfoComponent
}>
export function SeasonInfo({ seasonInfo }: Props): VNode {
    const [state, setState] = useState(initialSeasonInfoState)
    useEffect(() => {
        seasonInfo.onStateChange(setState)
        seasonInfo.load()
    }, [])

    switch (state.type) {
        case "initial-season":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return content(state.season)

        case "failed-to-load":
            return error(state.err)
    }
}

function content(season: Season): VNode {
    const { year } = season
    return html`
        <section class="menu__box">
            <dl class="form">
                <dt class="form__header">シーズン</dt>
                <dd class="form__field">${year}</dd>
            </dl>
        </section>
    `
}
function error(err: SeasonError): VNode {
    return html`
        <section class="menu__box">
            <dl class="form">
                <dt class="form__header">シーズン</dt>
                <dd class="form__field">
                    <p class="notice notice_alert">ロードエラー</p>
                    ${v_small()}
                    <small><p>詳細: ${err.err}</p></small>
                </dd>
            </dl>
        </section>
    `
}

const EMPTY_CONTENT = html``
