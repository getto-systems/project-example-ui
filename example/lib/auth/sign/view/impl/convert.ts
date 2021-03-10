import { SignViewSearch } from "../view"

import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/data"

export function signViewSearchLocationConverter<N extends string>(
    search: SignViewSearch<N>,
    getter: { (key: string): string | null },
): ConvertLocationResult<N> {
    const key = getter(search.key)
    if (!key) {
        return { valid: false }
    }
    if (key in search.variant) {
        return { valid: true, value: key as N }
    }
    return { valid: false }
}
