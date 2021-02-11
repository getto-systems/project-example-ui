import { loadContent } from "../impl/core"

import { ContentAction } from "../action"

export function initTestContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
