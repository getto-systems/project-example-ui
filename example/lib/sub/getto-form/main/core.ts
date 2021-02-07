import { validationStateSet } from "../action/impl/validation"
import { historyStack } from "../action/impl/history"

import { FormAction } from "../action/action"

export function initFormAction(): FormAction {
    return {
        validation: validationStateSet(),
        history: historyStack(),
    }
}
