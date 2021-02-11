import { h, VNode } from "preact"

import { ApplicationError } from "./ApplicationError"

export default {
    title: "common/System/ApplicationError",
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
    err: "application error",
}
