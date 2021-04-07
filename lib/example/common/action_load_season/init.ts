import { newLoadSeasonInfra } from "../load_season/impl/init"
import { initLoadSeasonCoreAction } from "./core/impl"
import { LoadSeasonResource } from "./resource"

type OutsideFeature = Readonly<{
    webDB: IDBFactory
}>
export function newLoadSeasonResource(feature: OutsideFeature): LoadSeasonResource {
    const { webDB } = feature
    return {
        season: initLoadSeasonCoreAction(newLoadSeasonInfra(webDB)),
    }
}
