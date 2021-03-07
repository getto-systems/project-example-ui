import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { NotFoundComponent } from "./NotFound"

import { initGetCurrentVersionResource } from "../../version/getCurrent/Action/impl"
import { initGetCurrentVersionCoreAction } from "../../version/getCurrent/Action/Core/impl"

export default {
    title: "main/public/Avail/NotFound",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    version: string
}
const template = storyTemplate<MockProps>((props) => {
    return h(
        NotFoundComponent,
        initGetCurrentVersionResource(
            initGetCurrentVersionCoreAction({
                version: props.version,
            }),
        ),
    )
})

export const Initial = template({ version: "1.0.0" })
