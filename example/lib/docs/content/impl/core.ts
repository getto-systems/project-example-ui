import { LoadContentPod } from "../action"

export const loadContent = (): LoadContentPod => (locationInfo) => (post) => {
    post({ type: "succeed-to-load", path: locationInfo.getContentPath() })
}
