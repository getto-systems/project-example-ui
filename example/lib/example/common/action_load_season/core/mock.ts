import { LoadSeasonCoreAction } from "./action"

import { LoadSeasonResult } from "../../load_season/data"

export function initMockLoadSeasonCoreAction(result: LoadSeasonResult): LoadSeasonCoreAction {
    return {
        load: () => result,
    }
}
