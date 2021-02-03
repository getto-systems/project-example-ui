import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import { box_double } from "../../../z_vendor/getto-css/preact/design/box"
import { field } from "../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../z_vendor/getto-css/preact/design/alignment"

import { useComponent } from "../../common/hooks"

import { ExampleComponent, initialExampleState } from "../../../example/Home/example/component"

import { Season, SeasonError } from "../../../example/shared/season/data"

type Props = Readonly<{
    example: ExampleComponent
}>
export function Example({ example }: Props): VNode {
    const state = useComponent(example, initialExampleState)
    useEffect(() => {
        example.load()
    }, [])

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
    return [notice_alert("ロードエラー"), v_small(), html`<small><p>詳細: ${err.err}</p></small>`]
}

const EMPTY_CONTENT = html``
