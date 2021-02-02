import { VNode } from "preact"
import { html } from "htm/preact"

import { iconClass, lnir } from "../../z_external/icon"

export function icon(name: string): VNode {
    return html`<i class="${iconClass(lnir(name))}"></i>`
}
export const spinner: VNode = html`<i class="lnir lnir-spinner lnir-is-spinning"></i>`
