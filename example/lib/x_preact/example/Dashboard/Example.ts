import { VNode } from "preact"
import { html } from "htm/preact"

import { useApplicationAction } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { box_double } from "../../../z_vendor/getto-css/preact/design/box"
import { field } from "../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../z_vendor/getto-css/preact/design/alignment"

import { VNodeContent } from "../../../common/x_preact/design/common"

import { ExampleComponent } from "../../../example/x_components/Dashboard/example/component"

import { Season, SeasonError } from "../../../example/common/season/data"

type Props = Readonly<{
    example: ExampleComponent
}>
export function Example(resource: Props): VNode {
    const state = useApplicationAction(resource.example)

    switch (state.type) {
        case "initial-example":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return seasonBox(seasonInfo(state.season))

        case "failed-to-load":
            return seasonBox(loadError(state.err))
    }
}

function seasonBox(body: VNodeContent): VNode {
    return box_double({
        title: "GETTO Example",
        body: field({
            title: "シーズン",
            body,
        }),
    })
}

function seasonInfo(season: Season): VNodeContent {
    return season.year
}

function loadError(err: SeasonError): VNodeContent {
    return [notice_alert("ロードエラー"), ...detail()]

    function detail(): VNode[] {
        if (err.err.length === 0) {
            return []
        }
        return [v_small(), html`<small><p>詳細: ${err.err}</p></small>`]
    }
}

const EMPTY_CONTENT = html``
