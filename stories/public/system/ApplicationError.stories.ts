import { h, VNode } from "preact"

import { ApplicationError } from "../../../public/lib/x_preact/System/ApplicationError"

export default {
    title: "public/System/ApplicationError",
}

type MockProps = Readonly<{
    err: string
}>
const Template: Story<MockProps> = (args) => {
    return h(ApplicationError, args)
}
interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Error = Template.bind({})
Error.args = {
    err: "error",
}
