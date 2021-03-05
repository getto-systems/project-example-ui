import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/detecter"

import { AuthSignViewSearch } from "./entryPoint"

export function authSignViewSearchLocationConverter<N extends string>(
    search: AuthSignViewSearch<N>,
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
