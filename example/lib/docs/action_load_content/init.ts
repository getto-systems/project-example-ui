import { newLoadDocsContentPathLocationDetecter } from "../load_content_path/impl/init"
import { initLoadDocsContentPathCoreAction } from "./core/impl"
import { LoadDocsContentPathResource } from "./resource"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newLoadDocsContentPathResource(
    feature: OutsideFeature,
): LoadDocsContentPathResource {
    const { currentLocation } = feature
    return {
        docsContentPath: initLoadDocsContentPathCoreAction(
            newLoadDocsContentPathLocationDetecter(currentLocation),
        ),
    }
}
