import { VNode } from "preact"
import { html } from "htm/preact"

import { field } from "../../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../../z_vendor/getto-css/preact/design/alignment"

import { VNodeContent } from "../../../../x_preact/design/common"

import { LoadSeasonResource } from "../resource"

import { RepositoryError } from "../../../../z_vendor/getto-application/infra/repository/data"
import { Season } from "../../load_season/data"

export function LoadSeasonFieldComponent(resource: LoadSeasonResource): VNode {
    return field({
        title: "シーズン",
        body: body(),
    })

    function body(): VNodeContent {
        const result = resource.season.load()
        if (!result.success) {
            return loadError(result.err)
        }
        return seasonInfo(result.value)
    }
}

function seasonInfo(season: Season): VNodeContent {
    return season.year
}

function loadError(err: RepositoryError): VNodeContent {
    return [notice_alert("ロードエラー"), ...detail()]

    function detail(): VNode[] {
        if (err.err.length === 0) {
            return []
        }
        return [v_small(), html`<small><p>詳細: ${err.err}</p></small>`]
    }
}
