import { h } from "preact"
import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { ApplicationError } from "./ApplicationError"

export default {
    title: "common/System/ApplicationError",
}

type MockProps = Readonly<{
    err: string
}>
const template = storyTemplate<MockProps>((args) => {
    return h(ApplicationError, args)
})

export const Error = template({ err: "application error" })
