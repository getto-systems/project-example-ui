import { SignViewLocationDetectMethod, SignViewLocationKeys } from "../view"
import { signViewSearchLocationConverter } from "./converter"

interface Detecter {
    (keys: SignViewLocationKeys): SignViewLocationDetectMethod
}
export const detectSignViewType: Detecter = (keys) => (currentURL) => {
    const password_reset = signViewSearchLocationConverter(keys.password.reset, (key) =>
        currentURL.searchParams.get(key),
    )
    if (password_reset.valid) {
        return { valid: true, value: viewTypes.reset[password_reset.value] }
    }

    return { valid: false }
}

const viewTypes = {
    reset: {
        requestToken: "password-reset-requestToken",
        checkStatus: "password-reset-checkStatus",
        reset: "password-reset",
    },
} as const
