import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"

import { PagerOptionsContent, SortSign } from "../../../z_vendor/getto-css/preact/design/data"

import { icon } from "../../../x_preact/common/icon"

export const sortSign: SortSign = {
    normal: icon("angle-double-down"),
    reverse: icon("angle-double-up"),
}

export function pagerCount(all: number): VNodeContent {
    return `全 ${pageCountFormat(all)} 件中`
}
export function pagerParams(all: number): PagerOptionsContent {
    return {
        all,
        step: 1000,
        content: ({ start, end }) => `${pageCountFormat(start)} ～ ${pageCountFormat(end)} 件`,
    }
}

export function pageCountFormat(count: number): string {
    return Intl.NumberFormat("ja-JP").format(count)
}
