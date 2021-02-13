import { validationStateSet } from "../form/impl/validation"
import { historyStack } from "../form/impl/history"

import { FormAction } from "../form/action"

export function initFormAction(): FormAction {
    return {
        validation: validationStateSet(),
        history: historyStack(),
    }
}
