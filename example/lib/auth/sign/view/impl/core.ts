import { SignViewLocationDetectMethod, SignViewLocationKeys } from "../view"
import { signViewSearchLocationConverter } from "./converter"

interface Detecter {
    (keys: SignViewLocationKeys): SignViewLocationDetectMethod
}
export const detectSignViewType: Detecter = (keys) => (currentURL) => {
    const search_static = signViewSearchLocationConverter(keys.static, (key) =>
        currentURL.searchParams.get(key),
    )
    if (search_static.valid) {
        return { valid: true, value: viewTypes.static[search_static.value] }
    }

    const password_reset = signViewSearchLocationConverter(keys.password.reset, (key) =>
        currentURL.searchParams.get(key),
    )
    if (password_reset.valid) {
        return { valid: true, value: viewTypes.reset[password_reset.value] }
    }

    return { valid: false }
}

const viewTypes = {
    static: {
        "privacy-policy": "static-privacyPolicy",
    },
    reset: {
        "request-token": "password-reset-requestToken",
        "check-status": "password-reset-checkStatus",
        reset: "password-reset",
    },
} as const
