import { loadContent } from "../impl/core"

import { ContentAction } from "../action"

export function initContentAction(): ContentAction {
    return {
        loadContent: loadContent(),
    }
}
